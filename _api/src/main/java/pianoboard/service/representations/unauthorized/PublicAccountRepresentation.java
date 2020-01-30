package pianoboard.service.representations.unauthorized;

import pianoboard.domain.account.*;
import pianoboard.service.representations.AccountRepresentation;
import pianoboard.service.representations.Link;
import pianoboard.resources.Resources;

import java.util.List;
import java.util.Arrays;

public class PublicAccountRepresentation extends AccountRepresentation {

	private String ID;
	private String username;
	private String email;
	private List<String> favoriteGenres;
	private List<String> favoriteArtists;

	public PublicAccountRepresentation() {}

	public PublicAccountRepresentation(Account a) {
		this.ID = a.getID();
		this.username = a.getUsername();
		this.email = a.getEmail();
		this.favoriteGenres = a.getFavoriteGenres();
		this.favoriteArtists = a.getFavoriteArtists();

		setLinks();
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

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */

	public void setID(String ID)							{ this.ID = ID;						}
	public void setUsername(String username)				{ this.username = username;			}
	public void setEmail(String email)						{ this.email = email;				}
	public void setFavoriteGenres(List<String> genres)		{ this.favoriteGenres = genres;		}
	public void setFavoriteArtists(List<String> artists)	{ this.favoriteArtists = artists;	}
	public void setLinks()							{
		this.setLinks(Arrays.asList(	new Link("refresh", "GET", Resources.rootURL + "/users/" + this.ID)));
	}

	public void addFavoriteGenre(String genre)						{ this.favoriteGenres.add(genre);					}
	public void addFavoriteArtist(String artists)					{ this.favoriteArtists.add(artists);				}
}
