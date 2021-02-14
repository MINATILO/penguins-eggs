import shx = require('shelljs')
import fs = require('fs')
import path = require('path')
import Utils from '../classes/utils'

/**
 * 
 * @param chroot 
 */
export async function add(user: string, userPasswd: string, rootPasswd: string, chroot = '/') {
    if (Utils.isSystemd()) {
        const fileOverride = `${chroot}/etc/systemd/system/getty@.service.d/override.conf`
        const dirOverride = path.dirname(fileOverride)
        if (fs.existsSync(dirOverride)) {
            shx.exec(`rm ${dirOverride} -rf`)
        }
        shx.exec(`mkdir ${dirOverride}`)
        let content = ''
        content += '[Service]' + '\n'
        content += 'ExecStart=' + '\n'
        content += 'ExecStart=-/sbin/agetty --noclear --autologin ' + user + ' %I $TERM' + '\n'
        fs.writeFileSync(fileOverride, content)
        shx.exec(`chmod +x ${fileOverride}`)
        await motdAdd(user, userPasswd, rootPasswd, chroot)
    }
}

/**
 * 
 * @param chroot 
 */
export async function remove(chroot = '/') {
    if (Utils.isSystemd()) {
        const fileOverride = `${chroot}/etc/systemd/system/getty@.service.d/override.conf`
        const dirOverride = path.dirname(fileOverride)
        if (fs.existsSync(dirOverride)) {
            shx.exec(`rm ${dirOverride} -rf`)
        }
        await motdRemove(chroot)
    }
}

/**
 * 
 * @param chroot 
 */
async function motdAdd(user: string, userPasswd: string, rootPasswd: string, chroot = '/') {
    const fileMotd = `${chroot}/etc/motd`

    motdRemove(chroot)

    let eggsMotd = fs.readFileSync(fileMotd, 'utf-8')
    eggsMotd += '#eggs-message\n'
    eggsMotd += 'This is a live eggs system!\n'
    eggsMotd += `You are logged as ${user}, with password: ${userPasswd}. root password is: ${rootPasswd} \n`
    eggsMotd += 'After installation you can add your favorite desktop, for example xfce4, cinnammon, \n'
    eggsMotd += 'mate, gnome, kde, etc and use the calamares graphical installation\n'
    eggsMotd += 'You can install it with eggs cli installer. eg: sudo eggs install\n'
    eggsMotd += '#eggs-message-stop\n\n'
    fs.writeFileSync(fileMotd, eggsMotd)
}

/**
 * 
 * @param chroot 
 */
async function motdRemove(chroot = '/') {
    const fileMotd = `${chroot}/etc/motd`
    let motd = fs.readFileSync(fileMotd, 'utf-8').split('\n')
    let cleanMotd = ''
    const eggsMessageStart = '#eggs-message'
    let isEggsMessage = false
    const eggsMessageStop = '#eggs-message-stop'
    for (let i = 0; i < motd.length; i++) {
        if (motd[i].includes(eggsMessageStart)) {
            isEggsMessage = true
        }

        if (!isEggsMessage) {
            cleanMotd += motd[i] + '\n'
        }

        if (motd[i].includes(eggsMessageStop)) {
            isEggsMessage = false
        }
    }
    fs.writeFileSync(fileMotd, cleanMotd)
}

