# Step-by-step guide for setting up website on AWS
A short comprehensive guide on the entire process of setting up a website on AWS, assuming the following:
- Domain is bought from Namecheap
- Website already exists and is built with Jekyll

## Create AWS Account
- Create root account
- Search for IAM Identity Center
- Create a user
- Create PermissionSet for user
- Assign PermissionSet to user
- Go to Settings
- Copy AWS access portal: https://d-9667b8c8bc.awsapps.com/start

## From now on, only use the new user
- Go to AWS Access Portal
- Login via new user
- Click on the PermissionSet in AWS Access Portal

## ACM Part 1
- Search for Certificate Manager
- Change to us-east-1 because of CloudFront
- Add <website>.com and www.<website>.com

## Nameservers
- Search for Route 53
- Create hosted name
- Add <website>.com and www.<website>.com
- Find 4 nameservers
- Copy all 4 nameservers and paste into Namecheap or other host providers' nameservers
- For Namecheap, change to Custom DNS in settings to allow pasting
- Save changes on Namecheap

## ACM Part 2
- Search for Certificate Manager
- Add to Route 53 for both <website>.com and www.<website>.com
- Wait for a while until both status are Success and certificate is Issued

## S3 Bucket
- Search for S3
- Change to ap-southeast-1 because of S3
- Create bucket: leerically-com-site
- Set name for bucket <website>-com-site
- Create folder called web in bucket
- If on Jekyll project, copy everything from _site/
- Paste into web/

## CF Distribution
- Go to CloudFront
- Create a distribution
- Add distribution name like <website>-website
- Add <website>.com to custom domain and subdomain www
- Specify Amazon S3 origin
- Select S3 created earlier
- If origin path not in root, type /web or whatever folder the site is in
- For TLS, select certificate created earlier

## A (Alias) Records
- Search for Route 53
- Go to hosted zone leerically.com
- Create record
- Choose record type A (IPv4)
- Create two records for root (apex) and www
- Turn both alias on
- Route endpoint to CloudFront distribution
- Select distribution created earlier

## MX Records
- Search for Route 53
- Go to hosted zone leerically.com
- Create record
- Choose record type MX
- Leave record name blank
- Paste this in value:
```
10 mx1.privateemail.com.
10 mx2.privateemail.com.
```

## TXT (SPF) Record
- Search for Route 53
- Go to hosted zone leerically.com
- Create record
- Choose record type TXT
- Leave record name blank
- Paste this in value:
```
v=spf1 include:spf.privateemail.com ~all
```

# Setting up GitHub Actions
Automate the process of deployment by directly shipping contents in the folder "_site/" to S3 bucket.

## Identity Provider
- Search for IAM
- Go to Identity providers
- Add provider
- Select OpenID Connect
- Add Provider URL: https://token.actions.githubusercontent.com
- Add Audience: sts.amazonaws.com

## IAM Policy
- Search for IAM
- Go to Policies
- Create policy
- Choose JSON
- Paste this in:
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": "arn:aws:s3:::leerically-com-site"
    },
    {
      "Sid": "WriteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:DeleteObject",
        "s3:AbortMultipartUpload",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::leerically-com-site/web/*"
    },
    {
      "Sid": "InvalidateCloudFront",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "*"
    }
  ]
}
```
- Takes a while before being able to click Next
- Name it LeericallyS3DeployPolicy

## Role ARN
- Go to Roles
- Create role
- For trusted entity, select Web identity
- Select Identity provider created earlier
- If GitHub repo is on https://github.com/leeyanleryan/Leerically/tree/main
- Organisation: leeyanleryan, Repository: Leerically, branch: main
- Select policy created earlier
- Name it GitHubActionsDeploy
- Create the role
- Copy the Role ARN: arn:aws:iam::192933325418:role/GithubActionsDeploy

## CF Distro ID
- Search for CloudFront
- Select distribution created earlier
- Copy ID of distribution: E9CHNVBXBNU4W

## S3 Bucket and Prefix
- Search for S3
- Select bucket created earlier
- Copy S3 bucket and prefix: leerically-com-site, web

## GitHub deploy.yml
- Go to GitHub repo
- Create a new file .github/workflows/deploy.yml
- Paste this in:
```
name: Build & Deploy Jekyll to S3

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  id-token: write     # OIDC to assume the AWS role
  contents: read

env:
  AWS_REGION: ap-southeast-1
  ROLE_ARN: arn:aws:iam::<ACCOUNT_ID>:role/GithubActionsDeploy   # <-- put your Role ARN here
  S3_BUCKET: leerically-com-site
  S3_PREFIX: web
  CF_DISTRIBUTION_ID: DXXXXXXXXXXXX                              # <-- put your CloudFront ID here
  JEKYLL_ENV: production

jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: deploy
      cancel-in-progress: true

    steps:
      - uses: actions/checkout@v4

      - uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true

      - name: Build Jekyll
        run: |
          bundle install
          bundle exec jekyll build --trace

      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Sync _site to S3
        run: |
          aws s3 sync ./_site s3://${{ env.S3_BUCKET }}/${{ env.S3_PREFIX }} --delete --only-show-errors

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ env.CF_DISTRIBUTION_ID }} --paths "/*"
```

## Allow Actions
- Go to GitHub repo on the website
- Go to Settings
- Go to Actions -> General
- Tick Allow all actions and reusable workflows

## Double-check
- Go to Actions
- Check if anything is wrong
- One issue: bundle lock --add-platform x86_64-linux