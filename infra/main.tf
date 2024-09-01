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