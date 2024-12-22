---
layout: post
title: "Securing Data-at-Rest in Android Applications: A Case Study on InsecureBank"
date: 2024-12-22 12:00:00 +0000
categories: android security
tags: android data-at-rest security insecurebank
---
# Securing Data-at-Rest in Android Applications: A Case Study on InsecureBank

## Introduction

Data-at-rest refers to information stored locally on a device, such as databases, configuration files, or cached data. Protecting this data is critical to ensure user privacy and security. In this blog, we will analyze how the intentionally vulnerable Android app, **InsecureBank**, demonstrates poor data-at-rest practices and explore how developers can secure such data effectively.

---

## Understanding InsecureBank Vulnerabilities

**InsecureBank** is a test application created to showcase common security issues in Android development. One of its critical flaws lies in its mishandling of locally stored sensitive data.

### Key Vulnerabilities

1. **Unencrypted SQLite Database**
   - User credentials and account details are stored in plaintext.

2. **Insecure SharedPreferences**
   - Sensitive data such as session tokens are stored in plaintext without encryption.

3. **Improper File Permissions**
   - Files created by the app are accessible by other apps, posing a security risk.

### Example: SharedPreferences Vulnerability
InsecureBank stores user details in a SharedPreferences file (`userdetails.xml`) in plaintext. This file can be accessed easily using tools like ADB or file managers.

---

## Risks of Poor Data-at-Rest Practices

1. **Data Breaches**
   - Attackers can retrieve sensitive information stored locally on the device.

2. **Identity Theft**
   - Leaked credentials may be reused in other systems or applications.

3. **Regulatory Non-compliance**
   - Applications with such flaws fail to meet standards like GDPR or PCI DSS.

---

## Mitigation Strategies for Data-at-Rest Security

### 1. Encrypt Sensitive Data
Use libraries such as **Jetpack Security** or **SQLCipher** to encrypt data stored in databases or SharedPreferences.

#### Example: Using Jetpack Security for SharedPreferences

```kotlin
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val securePrefs = EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

securePrefs.edit().putString("username", "secureUser").apply()
```

### 2. Use Android Keystore
Store sensitive keys securely using the Android Keystore system to prevent unauthorized access.

### 3. Restrict File Permissions
Ensure that app-created files are private by default:

```kotlin
val file = File(context.filesDir, "sensitive_data.txt")
file.setReadable(false, false)
file.setWritable(false, false)
```

### 4. Securely Delete Data
Overwrite or encrypt data before deletion to prevent recovery.

---

## Tools for Testing Android App Security

1. **MobSF** - A static and dynamic analysis tool for Android apps.
2. **Drozer** - A tool for identifying and exploiting Android app vulnerabilities.
3. **ADB (Android Debug Bridge)** - Useful for exploring app data stored on a device.

#### Example: Extracting Data via ADB

```bash
adb shell
cd /data/data/com.insecurebank/
cat shared_prefs/userdetails.xml
```

---

## Hands-on Practice: InsecureBank APK

### Download InsecureBank APK
You can download the InsecureBank APK from its official [GitHub repository](https://github.com/dineshshetty/Android-InsecureBankv2).

#### Steps to Analyze:

1. Install the APK on a test device or emulator.
2. Use tools like ADB or MobSF to inspect its storage mechanisms.
3. Identify vulnerabilities and implement mitigation strategies as discussed above.

---

## Conclusion

Protecting data-at-rest is a fundamental aspect of Android app security. By analyzing examples like **InsecureBank**, developers can understand common pitfalls and adopt best practices to safeguard user data.
