FROM mcr.microsoft.com/playwright:v1.41.0-focal

WORKDIR /app

# Copy dependencies package files
COPY mudah-listing-monitor/package*.json ./mudah-listing-monitor/

# Go inside source code directory
WORKDIR /app/mudah-listing-monitor

# Install dependencies
RUN npm install

#Go out back to /app to copy all data folder and source code
WORKDIR /app

# Copy source code
COPY . .

# Go inside source code directory
WORKDIR /app/mudah-listing-monitor

# Build TypeScript
RUN npm run build

# Create a backup script
#RUN echo '#!/bin/bash\n\
#mkdir -p /app/backups\n\
#[ -f /app/searchUrls.json ] && cp /app/searchUrls.json /app/backups/searchUrls.json.bak\n\
#[ -f /app/listing.db ] && cp /app/listing.db /app/backups/listing.db.bak\n\
#[ -f /app/.env ] && cp /app/.env /app/backups/.env.bak\n\
#echo "Backup completed."' > backup.sh

#RUN chmod +x backup.sh

# Create a script to run the app in a loop
RUN echo '#!/bin/bash\n\
while true; do\n\
  node dist/mudah-monitor.js\n\
  sleep 3600\n\
done' > run.sh

RUN chmod +x run.sh

CMD ["./run.sh"]