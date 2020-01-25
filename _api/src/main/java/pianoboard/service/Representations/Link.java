package pianoboard.service.Representations;

public class Link {

	private String action;
	private String url;

	public Link(String action, String url) {
		this.action = action;
		this.url = url;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getAction()		{ return this.action;	}
	public String getUrl()			{ return this.url;		}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setAction(String action)	{ this.action = action;	}
	public void setUrl(String url)			{ this.url = url;		}
}
