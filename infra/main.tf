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
  source = "./VPC"

  vpc_cidr              = "10.0.0.0/16"
  vpc_name              = "splitter-vpc"
  public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs  = ["10.0.3.0/24", "10.0.4.0/24"]
  public_subnet_count    = 2
  private_subnet_count   = 2
  availability_zones     = ["us-east-1a", "us-east-1b"]
}

resource "aws_ecr_repository" "splitter_api" {
  name                 = "splitter-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
  tags = local.default_tags
}