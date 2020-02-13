package pianoboard.service.representations;

import java.util.List;

public abstract class AccountRepresentation {

	private List<Link> links;

	public AccountRepresentation() {}

	public List<Link> getLinks()	 		{ return this.links;	}
	public void setLinks(List<Link> links)	{ this.links = links;	}
	public void addLink(Link link)			{ this.links.add(link);	}
}
