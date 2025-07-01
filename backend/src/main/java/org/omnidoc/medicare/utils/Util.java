package org.omnidoc.medicare.utils;

import org.springframework.stereotype.Service;

@Service
public class Util {


    public static String decryptIfNotNull(String encryptedValue) throws Exception {
        return encryptedValue != null ? AESUtil.decrypt(encryptedValue) : null;
    }

    public static String encryptIfNotNull(String value) throws Exception {
        return value != null ? AESUtil.encrypt(value) : null;
    }

}