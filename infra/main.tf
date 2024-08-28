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

resource "aws_ecr_repository" "splitter_api" {
  name                 = "splitter-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
  tags = local.default_tags
}