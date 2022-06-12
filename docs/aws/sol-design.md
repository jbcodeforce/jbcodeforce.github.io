# Solution design with AWS services


We try to address disaster and recovery for different needs, knowing that not all applications need active active deployment.

## Backup multi-regions

The simple resilience solution is to use backup and restore mechanism. Data, configuration can be moved to S3 with the second region. For even longer time w ecan use Glacier. Use database service to ensure HA at the zone level, and replicate data within AZ.

![](./images/backup-mr.png)

RPO will be average time between snapshot - and RTO at the day level.

## Warm region

For applications, where we want limit out of services time, the approach is to replicate AMI images so app servers, in DR region, can be restarted quickly. And Database are replicated and warm on the second region. Web servers are also warm but not receiving traffic.

![](./images/warm-dr.png)

If something go down in region 1, the internet facing router (53) will route to local balancers in second region.

RTO is now in minutes, and RPO average time between DB snapshots. 

## Active - Active between multi regions

### Write once - multi read pattern