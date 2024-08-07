resource "aws_s3_bucket" "default_frontend" {
  bucket = var.bucket_name
  tags = var.tags
}

resource "aws_cloudfront_origin_access_control" "default_oac" {
  name                              = var.oac_name
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}


resource "aws_cloudfront_distribution" "default_distribution" {

  origin {
    domain_name              = aws_s3_bucket.default_frontend.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.default_oac.id
    origin_id                = aws_s3_bucket.default_frontend.bucket_domain_name
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = aws_s3_bucket.default_frontend.bucket_domain_name

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }
  price_class = "PriceClass_200"
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = var.tags
}


data "aws_iam_policy_document" "default" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.default_frontend.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = ["${aws_cloudfront_distribution.default_distribution.arn}"]
    }
  }
  
}