package pianoboard.domain.account;

public class Token {

	private String token;
	private String username;
	private String expDate;

	public Token() {}

	public Token(String username, String token, String expDate) {
		this.username = username;
		this.token = token;
		this.expDate = expDate;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getToken()		{ return this.token;	}
	public String getUsername()		{ return this.username;	}
	public String getExpDate()		{ return this.expDate;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setToken(String token)			{ this.token = token;		}
	public void setUsername(String username)	{ this.username = username;	}
	public void setExpDate(String expDate)		{ this.expDate = expDate;	}
}
