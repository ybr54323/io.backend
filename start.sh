
. ~/.profile
git pull
tsc
pm2 stop all && pm2 delete all && pm2 start .
sleep 2
pm2 ls