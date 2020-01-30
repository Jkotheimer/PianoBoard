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
