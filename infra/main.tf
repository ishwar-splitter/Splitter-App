module "s3_and_cloudfront" {
  source                       = "./s3-cloudfront"
  tags                         = local.default_tags
  bucket_name                  = "ishwar-splitter-frontend"
  oac_name                     = "splitter_OAC"
  cloudfront_distribution_name = "splitter_distribution"
}


module "cognito" {
  source       = "./cognito"
  cognito_name = "splitter-user-pool"
  tags         = local.default_tags
}

module "vpc" {
  source = "./vpc"

  vpc_name = "ishwar-splitter-vpc"
  cidr = "10.0.0.0/16"
  azs = ["us-east-1a", "us-east-1b"]
  public_subnets = ["10.0.101.0/24", "10.0.102.0/24"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  database_subnets = ["10.0.151.0/24", "10.0.152.0/24"]
  create_database_subnet_group = true
  create_database_subnet_route_table = true
  enable_nat_gateway = true
  single_nat_gateway = true
  tags = local.default_tags
}

resource "aws_ecr_repository" "splitter_api" {
  name                 = "splitter-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
  tags = local.default_tags
}

resource "aws_secretsmanager_secret" "splitter_secret" {
  name = "ishwar-splitter-secret"
  description = "Splitter API secrets"
  recovery_window_in_days = 0
  tags = local.default_tags
}

resource "aws_db_instance" "splitter_db" {
  allocated_storage = 20
  instance_class = "db.t3.small"
  auto_minor_version_upgrade = false
  availability_zone = "us-east-1b"
  db_name = "expense_splitter"
  db_subnet_group_name = "ishwar-splitter-vpc"
  deletion_protection = true
  engine = "mysql"
  engine_version = "8.0.39"
  identifier = "ishwar-splitter-db"
  max_allocated_storage = 200
  multi_az = false
  skip_final_snapshot = true
  storage_encrypted = true
  storage_throughput = 0
  storage_type = "gp2"
  username = "Splitter_dev"
  copy_tags_to_snapshot = true
  tags = local.default_tags
}

module "ecs_cluster" {
  source = "./ECS"
  cluster_name = "ishwar-splitter-api-cluster"

  task_family = "ishwar-splitter-api-taskdef"
  cpu = "512"
  memory = "2048"
  container_name = "ishwar-splitter-api"
  ecr_repository_url = "949263681218.dkr.ecr.us-east-1.amazonaws.com/splitter-api"
  image_tag = ""
  container_port = 4000
  tags = local.default_tags

}

resource "aws_lb_target_group" "splitter_api_tg" {
  name     = "ishwar-splitter-api-tg"
  port = 80
  protocol = "HTTP"
  vpc_id = module.vpc.vpc_id
  target_type = "ip"
  protocol_version = "HTTP1"
  tags = local.default_tags

  health_check {
    enabled = true
    healthy_threshold = 5
    interval = 30
    matcher = "200"
    path = "/"
    port = "traffic-port"
    protocol = "HTTP"
    timeout = 5
    unhealthy_threshold = 2
  }
}

resource "aws_lb" "splitter_api_lb" {
  name               = "ishwar-splitter-api-alb"
  internal           = false
  load_balancer_type = "application"
  subnet_mapping {
    subnet_id = module.vpc.public_subnets[0]
  }
  subnet_mapping {
    subnet_id = module.vpc.public_subnets[1]
  }
  security_groups = [aws_security_group.splitter_api_lb_sg.id]
  
  tags = local.default_tags

}

resource "aws_security_group" "splitter_api_lb_sg" {
  name        = "alb-sg"
  description = "Security group for the ALB"
  vpc_id      = module.vpc.vpc_id 

  ingress {
    description = "Allow HTTP traffic"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ishwar-splitter-api-alb-sg"
  }
}

resource "aws_lb_listener" "http_listener" {
  load_balancer_arn = aws_lb.splitter_api_lb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.splitter_api_tg.arn
  }
}


resource "aws_lb_listener_rule" "example" {
  listener_arn = aws_lb_listener.http_listener.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.splitter_api_tg.arn
  }

  condition {
    
  }

}