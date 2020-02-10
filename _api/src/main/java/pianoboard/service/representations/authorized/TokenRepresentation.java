package pianoboard.service.representations.authorized;

import pianoboard.domain.account.Token;
import pianoboard.service.representations.Link;
import pianoboard.resources.Resources;
import java.util.List;
import java.util.Arrays;

public class TokenRepresentation {

	private String token;
	private String accountID;
	private List<Link> links;
	private long expiration_date;

	public TokenRepresentation(Token t) {
		this.token = t.getToken();
		this.accountID = t.getAccountID();
		this.expiration_date = t.getExpDate();
		this.links = Arrays.asList(	new Link("get_account", "POST", Resources.rootURL + "/users/" + t.getAccountID()),
									new Link("verify", "POST", Resources.rootURL + "/authentication/token")
		);
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getToken()		{ return this.token;			}
	public String getAccountID()	{ return this.accountID;		}
	public List<Link> getLinks()	{ return this.links;			}
	public long getExpirationDate()	{ return this.expiration_date;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setToken(String token)			{ this.token = token;			}
	public void setAccountID(String ID)			{ this.accountID = ID;			}
	public void setLink(List<Link> links)		{ this.links = links;			}
	public void setExpirationDate(long e)		{ this.expiration_date = e;		}
}
