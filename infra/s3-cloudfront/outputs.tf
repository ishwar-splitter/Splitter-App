output "bucket_arn" {
  value = aws_s3_bucket.default_frontend.arn
}

output "cloudfront_dns" {
  value = aws_cloudfront_distribution.default_distribution.domain_name
}