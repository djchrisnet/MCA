require('kbank.js');

var App = (new function() {
	this.onAppStart = function() {
		//liest die AppPersistence aus und setzt alle KontoDaten
		KBank.setData(KnuddelsServer.getPersistence().getObject('bank', {}));
	};
	
	this.onShutdown = function() {
		//sichert alle Konten in die AppPersistence
		KnuddelsServer.getPersistence().setObject('bank',  KBank.getData());
	};
	
	this.chatCommands = {
		kn: knCommand,
	};
	
	function knCommand(user, params, command) {
		uid = user.getUserId();

		if (params.length == 0) {
			//zeigt das Guthaben in der Bank an
			user.sendPrivateMessage('Dein Guthaben beträgt: _'+KBank.getKn(uid)+'Kn_');		
		} else if(params == '?') {
			//kann die Bank erklären
			user.sendPrivateMessage('Guthaben-Hilfe....');
		} else if (params == 'transit') {
			//Nur MCM sollten sehen wieviel die Bank selbst besitzt
			if(!user.isChannelModerator()) {
				user.sendPrivateMessage('Das willst du gar nicht wissen :P');
				return;
			}
			besitz = KnuddelsServer.getDefaultBotUser().getKnuddelAmount().asNumber();
			transit = KBank.getTransit();
			user.sendPrivateMessage('°#°Unausgezahltes Guthaben: _'+transit+'Kn_°#°Besitz des BotUsers: _'+besitz+'Kn_°#°Aktueller Gewinn: _'+(besitz-transit)+'Kn');
		} else if (params == 'payout') {
			//zahlt den User all sein Guthaben aus
			besitz = KnuddelsServer.getDefaultBotUser().getKnuddelAmount().asNumber();
			
			if(KBank.getKn(uid)>besitz) {
				user.sendPrivateMessage('Soviel hab ich zurzeit leider nicht! Wende dich an einen MCM oder warte bis ich genug Kn habe!');
				return;
			}
			
			if(KBank.getKn(uid)>0) {
				if(KBank.getKn(uid)>500) {
					packs = Math.floor(KBank.getKn(uid)/500);
					for (i = 0; i < packs; i++) {
						KBank.payout(uid, 500, 'Guthaben-Auszahlung');
					}
				}
				KBank.payout(uid, KBank.getKn(uid), 'Guthaben-Auszahlung');
			} else {
				user.sendPrivateMessage('Du hast kein Guthaben!');
			}
		} else if (params == 'add10') {
			//fügt dem User 10kn hinzu
			KBank.addKn(uid, 10);
			user.sendPrivateMessage('Dein Guthaben beträgt nun: _'+KBank.getKn(uid)+'Kn_');
		}
	};
	
	this.onKnuddelReceived = function(user, botUser, kn) {
		//eingezahlte Kn werden in der Bank eingezahlt!
		uid = user.getUserId();
		KBank.payin(uid, kn.asNumber());
		user.sendPrivateMessage('Dein Guthaben beträgt nun: _'+KBank.getKn(uid)+'Kn_!');
	};
}());