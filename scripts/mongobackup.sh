#!/bin/sh

#=====================================================================
# Set the following variables as per your requirement
#=====================================================================
# Database Name to backup
MONGO_DATABASE="company-id"
# Database URI
MONGO_URI="mongodb://127.0.0.1:27222"
# Database host name
MONGO_HOST="localhost"
# Database port
MONGO_PORT="27222"
# Backup directory
BACKUPS_DIR="/var/backups/$MONGO_DATABASE"
# Database user name
DBUSERNAME="username"
# Database password
DBPASSWORD="password"
# Authentication database name
DBAUTHDB="admin"
# Days to keep the backup
DAYSTORETAINBACKUP="14"
#=====================================================================

TIMESTAMP=`date +%F-%H%M`
BACKUP_NAME="$MONGO_DATABASE-$TIMESTAMP"

echo "Performing backup of $MONGO_DATABASE"
echo "--------------------------------------------"
# Create backup directory
if ! mkdir -p $BACKUPS_DIR; then
  echo "Can't create backup directory in $BACKUPS_DIR. Go and fix it!" 1>&2
  exit 1;
fi;
# Create dump
# mongodump -d $MONGO_DATABASE --username $DBUSERNAME --password $DBPASSWORD --authenticationDatabase $DBAUTHDB
mongodump  --host $MONGO_HOST --port $MONGO_PORT --db $MONGO_DATABASE –o $BACKUPS_DIR 
# Rename dump directory to backup name
mv dump $BACKUP_NAME
# Compress backup
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
# Delete uncompressed backup
rm -rf $BACKUP_NAME
# Delete backups older than retention period
find $BACKUPS_DIR -type f -mtime +$DAYSTORETAINBACKUP -exec rm {} +
echo "--------------------------------------------"
echo "Database backup complete!"