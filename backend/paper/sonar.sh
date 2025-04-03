docker run -d --name sonarqube \
  --network sonarnet \
  -p 9000:9000 \
  -e SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true \
  sonarqube:latest

sudo sonarqube-scanner