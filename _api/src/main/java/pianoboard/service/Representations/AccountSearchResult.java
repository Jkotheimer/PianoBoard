package pianoboard.service.Representations;

public class AccountSearchResult {

	private String username;
	private String email;
	private String ID;

	public AccountSearchResult(String ID, String email, String username) {
		this.ID = ID;
		this.email = email;
		this.username = username;
	}

	public AccountSearchResult() {}

	/**
	 * GETTERS
	 */

	public String getID()		{ return this.ID;		}
	public String getEmail()	{ return this.email;	}
	public String getUsername()	{ return this.username;	}

	/**
	 * SETTERS
	 */

	public void setID(String ID)				{ this.ID = ID;				}
	public void setEmail(String email)			{ this.email = email;		}
	public void setUsername(String username)	{ this.username = username;	}
}
