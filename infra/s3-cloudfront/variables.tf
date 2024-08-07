variable "bucket_name" {
  type        = string
  description = "name of the bucket"
}

variable "oac_name" {
  type        = string
  description = "cloudfront origin access control name"
}

variable "cloudfront_distribution_name" {
  type        = string
  description = "name of the cloudfront distribution"
}

variable "tags" {
  type        = map(any)
  description = "default tags"
}