package pianoboard.service.representations.unauthorized;

import pianoboard.domain.account.*;
import pianoboard.service.representations.AccountRepresentation;
import pianoboard.service.representations.Link;
import pianoboard.resources.Resources;

import java.util.Arrays;

public class PrivateAccountRepresentation extends AccountRepresentation {

	private String ID;
	private String username;
	private String email;

	public PrivateAccountRepresentation() {}

	public PrivateAccountRepresentation(Account a) {
		this.ID = a.getID();
		this.username = a.getUsername();
		this.email = a.getEmail();

		setLinks();
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getID()						{ return this.ID;				}
	public String getUsername()					{ return this.username;			}
	public String getEmail()					{ return this.email;			}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(String ID)							{ this.ID = ID;						}
	public void setUsername(String username)				{ this.username = username;			}
	public void setEmail(String email)						{ this.email = email;				}

	public void setLinks()					{
		this.setLinks(Arrays.asList(	new Link("refresh", "GET", Resources.apiURL + "users/" + this.ID)));
	}
}
