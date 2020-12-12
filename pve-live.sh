#!/bin/bash
IP=`hostname -I`
HOSTNAME=`hostname`
FQN=`host -TtA $HOSTNAME|grep "has address"|awk '{print $1}'`
#
# scrive il file /etc/hosts 
#
cat <<EOF >/etc/hosts
127.0.0.1 localhost localhost.localdomain
${IP} ${HOSTNAME} ${HOSTNAME}.lan pvelocalhost
# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
ff02::3 ip6-allhosts
EOF
