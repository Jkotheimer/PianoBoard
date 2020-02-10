package pianoboard.service.requests;

public class TokenRequest {

	private String token;
	private String accountID;

	public TokenRequest() {}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getToken()	{ return this.token;	}
	public String getAccountID(){ return this.accountID;}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setToken(String token)	{ this.token = token;	}
	public void setAccountID(String ID)	{ this.accountID = ID;	}
}
