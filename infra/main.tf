module "s3_and_cloudfront" {
  source                       = "./s3-cloudfont"
  tags                         = local.default_tags
  bucket_name                  = "splitter_frontend"
  oac_name                     = "splitter_OAC"
  cloudfront_distribution_name = "splitter_distribution"
}