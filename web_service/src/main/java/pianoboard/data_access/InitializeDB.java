package pianoboard.data_access;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.jsondb.JsonDBTemplate;
import io.jsondb.Util;
import io.jsondb.crypto.Default1Cipher;
import io.jsondb.crypto.ICipher;

public class InitializeDB {
	
	private ObjectMapper mapper;
	
	private String dbLocation = "src/main/database";
	private File dbFolder = new File(dbLocation);
	private File instancesJson = new File(dbLocation, "instances.json");
	private ICipher cipher;
	
	public InitializeDB() {
		dbFolder.mkdir();
		// TODO: pull this symmetric key from an encrypted local file
		try {
			cipher = new Default1Cipher("Qm9ic01vdGhlckZ1Y2tpbmdCdXJnZXJzMTIzNDA4OTc2");
		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
		mapper = new ObjectMapper();
	}
}
