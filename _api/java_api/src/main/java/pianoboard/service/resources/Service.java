package pianoboard.service.resources;

import javax.jws.WebService;
import javax.servlet.http.HttpServletRequest;

@WebService
public abstract class Service {

	public String getClientIp(HttpServletRequest request) {

		String remoteAddr = "null";

		if (request != null) {
			remoteAddr = request.getHeader("X-FORWARDED-FOR");
			if (remoteAddr == null || "".equals(remoteAddr)) {
				remoteAddr = request.getRemoteAddr();
			}
		}

		return remoteAddr;
	}
}
