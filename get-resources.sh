for region in `aws ec2 describe-regions --query 'Regions[].RegionName' --region us-west-1 --output text`
do
    echo "region = ${region}"
    aws resourcegroupstaggingapi get-resources --region ${region} --query 'ResourceTagMappingList[].ResourceARN';
done