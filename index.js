var http = require('http');
var Evernote = require('evernote').Evernote;
var fs = require('fs');
var config = require('./production.config.json');
var client = new Evernote.Client({token: config.key, sandbox: false});
var savePath = __dirname + '/' + config.guidfile;
var noteStore = client.getNoteStore();

http.request(config.heroku, function(res) {
  var body = '';
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    body += chunk;
  });
  res.on('end', function() {
    saveNote(body);
  })
}).end();

function createNewNote(ip) {
  var note = new Evernote.Note();
  note.title = 'IP Address';
  note.content = '<?xml version="1.0" encoding="UTF-8"?>';
  note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
  note.content += '<en-note>' + ip + ' - ' + Date().toString() + '<br/>';
  note.content += '</en-note>';

  noteStore.createNote(note, function(err, createdNote) {
    if (err) {
      console.log(err);
    } else {
      fs.writeFile(savePath, createdNote.guid, function (err) {
        if (err) throw err;
      });
    }
  });
}

function updateExistingNote(guid, ip) {
  noteStore.getNote(config.key, guid, false, false, false, false, function(err, note) {
    note.title = 'IP Address';
    note.content = '<?xml version="1.0" encoding="UTF-8"?>';
    note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
    note.content += '<en-note>' + ip + ' - ' + Date().toString() + '<br/>';
    note.content += '</en-note>';
    noteStore.updateNote(config.key, note, function(err) {
       if (err) {
         console.log(err);
       }
    });
  });
}

function saveNote(ipAddress) {
  fs.readFile(savePath, 'utf-8', function(err, guid) {
    if (guid) {
      updateExistingNote(guid, ipAddress);
    } else {
      createNewNote(ipAddress);
    }
  });
}
