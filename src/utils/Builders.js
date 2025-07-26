/*
    Baileys MessageBuilder by github.com/ZTRdiamond
    ------------------------------------------------------
    Source: https://github.com/ZanixonGroup/amira-bot-base
    | Don't delete this credit!
*/

import _ from "lodash";

export class MessageBuilder {
  constructor(){
    this.message = {
      contextInfo: {
        externalAdReply: {
          mediaType: 1,
          previewType: 0
        }
      }
    };
  }
  
  setStyle(type) {
    if(type === 1) {
      _.merge(this.message, {
        contextInfo: {
          externalAdReply: {
            mediaType: 1,
            previewType: 0,
            title: 'Amira Assistant | WhatsApp Chatbot',
            body: 'Copyright © ZanixonGroup 2024 - All Right Reserved',
            renderLargerThumbnail: true,
            thumbnailUrl: 'https://telegra.ph/file/906c47ef4ab5bb9ccbe48.jpg',
            sourceUrl: 'https://s.id/znxnwa'
          },
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363183632297680@newsletter',
            newsletterName: 'Dikembangkan oleh Zanixon Group™'
          }
        }
      });
      return this;
    } else if(type === 2) {
      _.merge(this.message, {
        contextInfo: {
          externalAdReply: {
            mediaType: 1,
            previewType: 0,
            title: 'Amira Assistant | WhatsApp Chatbot',
            body: 'Copyright © ZanixonGroup 2024 - All Right Reserved',
            renderLargerThumbnail: false,
            thumbnailUrl: 'https://telegra.ph/file/de91ab539e7a29b404f7c.jpg',
            sourceUrl: 'https://s.id/znxnwa'
          },
          forwardingScore: 9999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363183632297680@newsletter',
            newsletterName: 'Dikembangkan oleh Zanixon Group™'
          }
        }
      });
      return this;
    } else {
      return {};
    }
  }
  
  setText(text) {
    _.set(this.message, 'text', text);
    return this;
  }
  
  setCaption(caption) {
    _.set(this.message, 'caption', caption);
    return this;
  }
  
  setImage(image) {
    _.set(this.message, 'image', image);
    return this;
  }
  
  setVideo(video) {
    _.set(this.message, 'video', video);
    return this;
  }
  
  setAudio(audio) {
    _.set(this.message, 'audio', audio);
    return this;
  }
  
  setDocument(document) {
    _.set(this.message, 'document', document);
    return this;
  }
  
  setMimetype(mimetype) {
    _.set(this.message, 'mimetype', mimetype);
    return this;
  }
  
  setMentions(mentions) {
    _.set(this.message, 'mentions', mentions);
    _.set(this.message, 'contextInfo.mentionedJid', mentions);
    return this;
  }
  
  setForwardingScore(score = 5) {
    _.set(this.message, "contextInfo.forwardingScore", score);
    return this;
  }
  
  setForwarded(status = false) {
    _.set(this.message, "contextInfo.isForwarded", status);
    return this;
  }
  
  setThumbnailTitle(title) {
    _.set(this.message, 'contextInfo.externalAdReply.title', title);
    return this;
  }
  
  setThumbnailBody(body) {
    _.set(this.message, 'contextInfo.externalAdReply.body', body);
    return this;
  }
  
  setThumbnailAds(ads = false) {
    _.set(this.message, 'contextInfo.externalAdReply.showAdAttribution', ads);
    return this;
  }
  
  setThumbnailMediaUrl(url) {
    _.set(this.message, 'contextInfo.externalAdReply.mediaUrl', url);
    return this;
  }
  
  setThumbnailImage(image) {
    if(typeof image === "string") {
      _.set(this.message, 'contextInfo.externalAdReply.thumbnailUrl', image);
    } else {
      _.set(this.message, 'contextInfo.externalAdReply.thumbnail', image);
    }
    return this;
  }
  
  setThumbnailLarge() {
    _.set(this.message, 'contextInfo.externalAdReply.renderLargerThumbnail', true);
    return this;
  }
  
  setThumbnailSmall() {
    _.set(this.message, 'contextInfo.externalAdReply.renderLargerThumbnail', false);
    return this;
  }
  
  setThumbnailUrl(url) {
    _.set(this.message, 'contextInfo.externalAdReply.sourceUrl', url);
    return this;
  }
  
  setThumbnailMediatype(type = 1) {
    _.set(this.message, 'contextInfo.externalAdReply.mediaType', type);
    return this;
  }
  
  setThumbnailPreviewtype(type = "PHOTO") {
    _.set(this.message, 'contextInfo.externalAdReply.previewType', type);
    return this;
  }
  
  setNewsletterJid(jid) {
    _.set(this.message, 'contextInfo.forwardedNewsletterMessageInfo.newsletterJid', jid);
    return this;
  }
  
  setNewsletterName(name) {
    _.set(this.message, 'contextInfo.forwardedNewsletterMessageInfo.newsletterName', name);
    return this;
  }
  
  setNewsletterServerMessageId(id = 125) {
    _.set(this.message, 'contextInfo.forwardedNewsletterMessageInfo.serverMessageId', id);
    return this;
  }
  
  isAI(q) {
    _.set(this.message, 'contextInfo')
  }
  
  build() {
    return _.cloneDeep(this.message);
  }
}

export class VCardBuilder {
  constructor() {
    this.card = {
      model: "fakeReply",
      label: "",
      fullName: null,
      org: null,
      number: null
    }
    this.message = {
      fakeReply: {
        "key": {
          "participants": "0@s.whatsapp.net",
          "remoteJid": "status@broadcast",
          "fromMe": false,
          "id": "Amira-MD"
        },
        "message": {
          "contactMessage": {
            "vcard": null
          }
        },
        "participant": "0@s.whatsapp.net"
      },
      contact: {
        displayName: null,
        vcard: null
      }
    }
  }
  
  setModel(text) {
    _.set(this.card, "model", text);
    return this;
  }
  
  setParticipant(text) {
    _.set(this.message.fakeReply, "participant", text);
    return this;
  }
  
  setKeyParticipants(text) {
    _.set(this.message.fakeReply, "key.participants", text);
    return this;
  }
  
  setKeyJid(text) {
    _.set(this.message.fakeReply, "key.remoteJid", text);
    return this;
  }
  
  setKeyFromMe(text) {
    _.set(this.message.fakeReply, "key.fromMe", text);
    return this;
  }
  
  setKeyId(text) {
    _.set(this.message.fakeReply, "key.id", text);
    return this;
  }
  
  setCardLabel(text = null) {
    _.set(this.card, "label", text)
    return this;
  }
  
  setCardFullName(text = null) {
    _.set(this.card, "fullName", text)
    return this;
  }
  
  setCardOrg(text = null) {
    _.set(this.card, "org", text)
    return this;
  }
  
  setCardNumber(text = null) {
    _.set(this.card, "number", text)
    return this;
  }
  
  build() {
    let vcard;
    let model = this.card.model;
    if(model == "fakeReply") {
      vcard = `BEGIN:VCARD\n` +
        + 'VERSION:3.0\n' 
        + `FN:${this.card.fullName}\n` 
        + `ORG:${this.card.org};\n`
        + `TEL;type=CELL;type=VOICE;waid=${this.card.number.split("@")[0]}:+${this.card.number.split("@")[0]}\n`
        + 'END:VCARD';
      _.set(this.message.fakeReply, "message.contactMessage.vcard", vcard);
      return _.cloneDeep(this.message.fakeReply)
    } else if(model == "contact") {
      vcard = `BEGIN:VCARD\n` +
        `VERSION:3.0\n` +
        `N:T;\n` +
        `FN:${this.card.fullName}\n` +
        `item1.TEL;waid=${this.card.number.split("@")[0]}:+${this.card.number.split("@")[0]}\n` +
        `item1.X-ABLabel:${this.card.label}\n` +
        `END:VCARD`;
      _.set(this.message.contact, "displayName", this.card.fullName);
      _.set(this.message.contact, "vcard", vcard);
      return _.cloneDeep(this.message.contact)
    } else {
      return {}
    }
  }
}

export class RelayBuilder{
  constructor(){
    this.message = {};
  }
}