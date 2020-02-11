package pianoboard.service.representations.authorized;

import pianoboard.domain.account.*;
import pianoboard.service.representations.AccountRepresentation;
import pianoboard.service.representations.Link;
import pianoboard.resources.Resources;

import java.util.List;
import java.util.Arrays;

public class AuthorizedAccountRepresentation extends AccountRepresentation {

	private String ID;
	private String email;
	private String username;
	private long creationDate;
	private boolean isPrivate;

	private List<String> favoriteGenres;
	private List<String> favoriteArtists;

	public AuthorizedAccountRepresentation(Account a) {
		this.ID = a.getID();
		this.email = a.getEmail();
		this.username = a.getUsername();
		this.creationDate = a.getCreationDate();
		this.isPrivate = a.isPrivate();
		this.favoriteGenres = a.getFavoriteGenres();
		this.favoriteArtists = a.getFavoriteArtists();

		this.setLinks();
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getID()					{ return this.ID;				}
	public String getEmail()				{ return this.email;			}
	public String getUsername()				{ return this.username;			}
	public long getCreationDate()			{ return this.creationDate;		}
	public boolean isPrivate()				{ return this.isPrivate;		}
	public List<String> getFavoriteGenres()	{ return this.favoriteGenres;	}
	public List<String> getFavoriteArtists(){ return this.favoriteArtists;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setID(String ID)					{ this.ID = ID;				}
	public void setEmail(String email)				{ this.email = email;		}
	public void setUsername(String username)		{ this.username = username;	}
	public void setIsPrivate(boolean value)			{ this.isPrivate = value;	}
	public void setFavoriteGenres(List<String> g)	{ this.favoriteGenres = g;	}
	public void setFavoriteArtists(List<String> a)	{ this.favoriteArtists = a;	}

	public void addFavoriteGenre(String g)			{ this.favoriteGenres.add(g);	}
	public void addFavoriteArtists(String a)		{ this.favoriteArtists.add(a);	}

	private void setLinks() {
		this.setLinks(Arrays.asList	(	new Link("login", "POST", Resources.rootURL + "/authentication/login"),
										new Link("refresh", "GET", Resources.rootURL + "/users/" + this.ID),
										new Link("updateUsername", "PATCH", "/users/" + this.ID + "/username"),
										new Link("updateEmail", "PATCH", "/users/" + this.ID + "/email"),
										new Link("updatePassword", "PATCH", "/users/" + this.ID + "/password"),
										new Link("addFavoriteGenre", "PATCH", "/users/" + this.ID + "/favoriteGenres"),
										new Link("addFavoriteArtist", "PATCH", "/users/" + this.ID + "/favoriteArtists"),
										new Link("removeFavoriteGenre", "DELETE", "/users/" + this.ID + "/favoriteGenres"),
										new Link("removeFavoriteArtist", "DELETE", "/users/" + this.ID + "/favoriteArtists"),
										new Link("deleteAccount", "DELETE", "/users/" + this.ID)
									)
		);
	}
}
