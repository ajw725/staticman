'use strict'

const path = require('path')
const config = require(path.join(__dirname, '/../config'))

const Notification = function (mailAgent) {
  this.mailAgent = mailAgent
}

Notification.prototype._buildMessage = function (fields, options, data) {
  return `
  <html>
    <body>
      Hello friend,<br>
      <br>
      Someone replied to a thread you posted in${data.siteName ? ` on <strong>${data.siteName}</strong>` : ''}.<br>
      <br>
      ${options.origin ? `<a href="${options.origin}">Click here</a> to see it.` : ''} If you do not wish to receive any further notifications for this thread, <a href="%mailing_list_unsubscribe_url%">click here</a>.<br>
      <br><br>
      <a href="https://staticman.net">Your friendly neighborhood comment bot</a>
    </body>
  </html>
  `
}

Notification.prototype.send = function (to, fields, options, data) {
  const subject = data.siteName ? `New reply on "${data.siteName}"` : 'New reply'

  return new Promise((resolve, reject) => {
    this.mailAgent.messages().send({
      from: `Admin <${config.get('email.fromAddress')}>`,
      to,
      subject,
      html: this._buildMessage(fields, options, data)
    }, (err, res) => {
      if (err) {
        return reject(err)
      }

      return resolve(res)
    })
  })
}

module.exports = Notification
