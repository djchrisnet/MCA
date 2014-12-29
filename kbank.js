/**
*
* @package MCA
* @version $Id$
* @copyright (c) 2014 djchrisnet
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
*
*/

var KBank = (new function(data) {
	var _data = {};
	
	this.create = function(uid) {
		if(uid === undefined) {
			return;
		}
		
		if(_data[uid] === undefined) {
			_data[uid] = {
				knuddel: 0.00,
				buyin: 0.00,
				payout: 0.00,
			};
		}
	};
	
	this.getKn = function(uid) {
		if(uid === undefined) {
			return;
		}
		
		this.create(uid);
		return _data[uid].knuddel;
	};
	
	this.getKonto = function(uid) {
		if(uid === undefined) {
			return;
		}
		
		this.create(uid);
		return _data[uid];
	};

	this.setKn = function(uid, kn) {
		if(uid === undefined) {
			return;
		}
		
		if(kn === undefined) {
			return;
		}
		
		this.create(uid);

		if(kn < 0) {
			return false;
		}

		_data[uid].knuddel = kn;
	};
	
	this.addKn = function(uid, kn) {
		if(uid === undefined) {
			return;
		}
		
		if(kn === undefined) {
			return;
		}
		
		this.create(uid);
		_data[uid].knuddel += kn;
	};

	this.rmKn = function(uid, kn) {
		if(uid === undefined) {
			return;
		}
		
		if(kn === undefined) {
			return;
		}
		
		this.create(uid);
		
		if(kn < 0) {
			return false;
		}
		
		if(_data[uid].knuddel < kn) {
			return false;
		}
		
		_data[uid].knuddel -= kn;
		return true;
	};
	
	this.payout = function(uid, kn, reason) {
		if(uid === undefined) {
			return false;
		}
		
		if(kn === undefined) {
			return false;
		}
		
		if(kn > _data[uid].knuddel) {
			return false;
		}

		if(kn < 1) {
			return false;
		}
		
		this.create(uid);
		_data[uid].knuddel -= kn;
		_data[uid].payout += kn;
		
		if(reason === undefined) {
			KnuddelsServer.getDefaultBotUser().transferKnuddel(KnuddelsServer.getUser(uid), kn);
		} else {
			KnuddelsServer.getDefaultBotUser().transferKnuddel(KnuddelsServer.getUser(uid), kn, reason);
		}
		return true;
	};

	this.payin = function(uid, kn) {
		if(uid === undefined) {
			return;
		}
		
		if(kn === undefined) {
			return;
		}
		
		this.create(uid);
		_data[uid].knuddel += kn;
		_data[uid].buyin += kn;
	};
	
	this.getData = function() {
		return _data;
	};

	this.setData = function(data) {
		if(data === undefined) {
			return;
		}
		_data = data;
	};	
	
	this.getUsers = function() {
		return Object.keys(_data);
	};
	
	this.getTransit = function() {
		transit = 0.00;
		
		for(var uid in _data) {
			transit += this.getKn(uid);
		}
		
		return transit;
	};
}());