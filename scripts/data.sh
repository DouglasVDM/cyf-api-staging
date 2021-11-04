# Variables
DATE=$(date '+%Y-%m-%d')
BASTION_BACKUP_DIR=/data/backups
BACKUP_DB_NAME=CYFDevDB
BACKUP_FILE_NAME=${BACKUP_DB_NAME}-${DATE}.gzip
FILEPATH=${BASTION_BACKUP_DIR}/${BACKUP_FILE_NAME}
DOWNLOAD_DIR=/tmp/backups

# ensure download path exists
mkdir -p ${DOWNLOAD_DIR}
DOWNLOAD_FULL_PATH=${DOWNLOAD_DIR}/${BACKUP_FILE_NAME}

# Download Database backup/dump
scp cyf-bastion:${FILEPATH} ${DOWNLOAD_FULL_PATH}

# Restore local DB from Database backup/dump
mongorestore --host localhost:27017 --gzip --archive=${DOWNLOAD_FULL_PATH}
rm -rf ${DOWNLOAD_DIR}
