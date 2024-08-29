// vpc/main.tf
resource "aws_vpc" "this" {
  cidr_block = var.vpc_cidr
  enable_dns_support = true
  enable_dns_hostnames = true
  tags = {
    Name = var.vpc_name
  }
}

resource "aws_subnet" "public" {
  count = var.public_subnet_count
  vpc_id = aws_vpc.this.id
  cidr_block = element(var.public_subnet_cidrs, count.index)
  availability_zone = element(var.availability_zones, count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.vpc_name}-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count = var.private_subnet_count
  vpc_id = aws_vpc.this.id
  cidr_block = element(var.private_subnet_cidrs, count.index)
  availability_zone = element(var.availability_zones, count.index)
  tags = {
    Name = "${var.vpc_name}-private-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags = {
    Name = "${var.vpc_name}-igw"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = {
    Name = "${var.vpc_name}-public-rt"
  }
}

resource "aws_route_table_association" "public" {
  count = var.public_subnet_count
  subnet_id = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_nat_gateway" "this" {
  allocation_id = aws_eip.nat.id
  subnet_id    = aws_subnet.public[0].id // Use the first public subnet for NAT Gateway
  tags = {
    Name = "${var.vpc_name}-nat-gateway"
  }
}

resource "aws_eip" "nat" {
  vpc = true
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.this.id
  }
  tags = {
    Name = "${var.vpc_name}-private-rt"
  }
}

resource "aws_route_table_association" "private" {
  count = var.private_subnet_count
  subnet_id = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

// Security Groups
resource "aws_security_group" "public" {
  vpc_id = aws_vpc.this.id
  name   = "${var.vpc_name}-public-sg"
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" // All traffic
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "private" {
  vpc_id = aws_vpc.this.id
  name   = "${var.vpc_name}-private-sg"
  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" // All traffic
    security_groups = [aws_security_group.public.id] // Allow traffic from public SG
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" // All traffic
    cidr_blocks = ["0.0.0.0/0"]
  }
}
