package org.omnidoc.medicare.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

public class HmacUtil {
    private static final String HMAC_ALGO = "HmacSHA256";

    private static String SECRET_KEY;
    public static void setSecretKey(String secretKey) {
        SECRET_KEY = secretKey;
    }

    public static String hmac(String data) {
        try {
            Mac hmac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec keySpec = new SecretKeySpec(SECRET_KEY.getBytes(), HMAC_ALGO);
            hmac.init(keySpec);
            byte[] hash = hmac.doFinal(data.getBytes());
            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("HMAC failure", e);
        }
    }
}