package pianoboard.domain.account;

class LoginRecord {

	private String IP;
	private int loginCount;
	private long lastLoginDate;

	public LoginRecord(String IP, long timestamp) {
		this.IP = IP;
		this.lastLoginDate = timestamp;
		this.loginCount = 1;
	}

	public LoginRecord() {}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getIP()			{ return this.IP;			}
	public int getLoginCount()		{ return this.loginCount;	}
	public long getLastLoginDate()	{ return this.lastLoginDate;}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setIP(String IP)					{ this.IP = IP;						}
	public void addLogin()							{ this.loginCount++;				}
	public void setLastLoginDate(long timestamp)	{ this.lastLoginDate = timestamp;	}
}
