package pianoboard.service.Representations;

public class Link {

	private String action;
	private String method;
	private String url;

	public Link(String action, String method, String url) {
		this.action = action;
		this.method = method;
		this.url = url;
	}

	/**
	 * GETTERS
	 * ________________________________________________________________________
	 */
	public String getAction()		{ return this.action;	}
	public String getUrl()			{ return this.url;		}
	public String getMethod()		{ return this.method;	}

	/**
	 * SETTERS
	 * ________________________________________________________________________
	 */
	public void setAction(String action)	{ this.action = action;	}
	public void setUrl(String url)			{ this.url = url;		}
	public void setMethod(String method)	{ this.method = method;	}
}
