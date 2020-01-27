package pianoboard.service.representations;

import pianoboard.domain.account.*;
import java.util.List;
import java.util.Map;

public class AccountRepresentation {

	private String ID;
	private String username;
	private String email;
	private List<String> favoriteGenres;
	private List<String> favoriteArtists;

	private List<Link> links;

	public AccountRepresentation() {}

	public AccountRepresentation(Account a) {
		this.ID = a.getID();
		this.username = a.getUsername();
		this.email = a.getEmail();
		this.favoriteGenres = a.getFavoriteGenres();
		this.favoriteArtists = a.getFavoriteArtists();
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */

	public String getID()						{ return this.ID;				}
	public String getUsername()					{ return this.username;			}
	public String getEmail()					{ return this.email;			}
	public List<String> getFavoriteGenres()		{ return this.favoriteGenres;	}
	public List<String> getFavoriteArtists()	{ return this.favoriteArtists;	}
	public List<Link> getLinks()				{ return this.links;			}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(String ID)							{ this.ID = ID;						}
	public void setUsername(String username)				{ this.username = username;			}
	public void setEmail(String email)						{ this.email = email;				}
	public void setFavoriteGenres(List<String> genres)		{ this.favoriteGenres = genres;		}
	public void setFavoriteArtists(List<String> artists)	{ this.favoriteArtists = artists;	}
	public void setLinks(List<Link> links)					{ this.links = links;				}

	public void addFavoriteGenre(String genre)						{ this.favoriteGenres.add(genre);					}
	public void addFavoriteArtist(String artists)					{ this.favoriteArtists.add(artists);				}
	public void addLink(String action, String method, String url)	{ this.links.add(new Link(action, method, url));	}
}
