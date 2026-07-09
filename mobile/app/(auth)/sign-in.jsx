// import { useSignIn } from "@clerk/clerk-expo";
// import { Link, useRouter } from "expo-router";
// import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
// import { useState } from "react";
// // import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
// // import { styles } from "../../assets/styles/auth.styles";
// import { styles } from "@/assets/styles/auth.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { COLORS } from "../../constants/colors";

// export default function Page() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   // Track if we need to show the 2FA input UI
//   const [displaySecondFactor, setDisplaySecondFactor] = useState(false);

//   // Handle the submission of the sign-in form
//   const onSignInPress = async () => {
//     if (!isLoaded) return;

//     // Start the sign-in process using the email and password provided
//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       // If sign-in process is complete, set the created session as active
//       // and redirect the user
//       if (signInAttempt.status === "complete") {
//         await setActive({ session: signInAttempt.createdSessionId });
//         router.replace("/");
//       } else {
//         // If the status isn't complete, check why. User might need to
//         // complete further steps.
//         console.error(JSON.stringify(signInAttempt, null, 2));
//       }
//     } catch (err) {
//       console.log(err.errors);
//       if (err.errors?.[0]?.code === "form_password_incorrect") {
//         setError("Password is incorrect. Please try again.");
//       } else {
//         setError("An error occurred. Please try again.");
//       }
//     }
//   };
//   // const onSignInPress = async () => {
//   //   if (!isLoaded) return;

//   //   // Start the sign-in process using the email and password provided
//   //   try {
//   //     const signInAttempt = await signIn.create({
//   //       identifier: emailAddress,
//   //       password,
//   //     });

//   //     // Check if 2FA is required
//   //     if (completeSignIn.status === "needs_second_factor") {
//   //       // 1. Trigger the email code delivery
//   //       await completeSignIn.prepareFirstFactor({
//   //         strategy: "email_code",
//   //       });

//   //       // 2. Show the OTP input field
//   //       setDisplaySecondFactor(true);

//   //       // If sign-in process is complete, set the created session as active
//   //       // and redirect the user
//   //     } else if (signInAttempt.status === "complete") {
//   //       await setActive({ session: signInAttempt.createdSessionId });
//   //       router.replace("/");
//   //     } else {
//   //       // If the status isn't complete, check why. User might need to
//   //       // complete further steps.
//   //       console.error(JSON.stringify(signInAttempt, null, 2));
//   //     }
//   //   } catch (err) {
//   //     if (err.errors?.[0]?.code === "form_password_incorrect") {
//   //       setError("Password is incorrect. Please try again.");
//   //     } else {
//   //       setError("An error occurred. Please try again.");
//   //     }
//   //   }
//   // };

//   // // Step 2: Handle 2FA Code Submission
//   // const onVerifySecondFactorPress = async () => {
//   //   if (!isLoaded) return;

//   //   try {
//   //     // Verify the code against the second factor strategy
//   //     const completeSignIn = await signIn.attemptSecondFactor({
//   //       strategy: "email_code",
//   //       code: code,
//   //     });

//   //     if (completeSignIn.status === "complete") {
//   //       await setActive({ session: completeSignIn.createdSessionId });
//   //       console.log("Successfully signed in with 2FA!");
//   //     } else {
//   //       console.log("Additional steps required:", completeSignIn.status);
//   //     }
//   //   } catch (err) {
//   //     console.error(JSON.stringify(err, null, 2));
//   //   }
//   // };

//   // // Render 2FA UI if required
//   // if (displaySecondFactor) {
//   //   return (
//   //     <View style={{ padding: 20, marginTop: 50 }}>
//   //       <Text>Enter the 2FA code sent to your email:</Text>
//   //       <TextInput
//   //         value={code}
//   //         placeholder="123456"
//   //         onChangeText={(code) => setCode(code)}
//   //         keyboardType="number-pad"
//   //         style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
//   //       />
//   //       <Button title="Verify Code" onPress={onVerifySecondFactorPress} />
//   //     </View>
//   //   );
//   // }

//   return (
//     <KeyboardAwareScrollView
//       style={{ flex: 1 }}
//       contentContainerStyle={{ flexGrow: 1 }}
//       bottomOffset={50} // Use this instead of extraScrollHeight if you want extra space above the keyboard
//       // enableOnAndroid={true}
//       // enableAutomaticScroll={true}
//       // extraScrollHeight={30}
//     >
//       <View style={styles.container}>
//         <Image
//           source={require("../../assets/images/revenue-i4.png")}
//           style={styles.illustration}
//         />
//         <Text style={styles.title}>Welcome Back</Text>

//         {error ? (
//           <View style={styles.errorBox}>
//             <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
//             <Text style={styles.errorText}>{error}</Text>
//             <TouchableOpacity onPress={() => setError("")}>
//               <Ionicons name="close" size={20} color={COLORS.textLight} />
//             </TouchableOpacity>
//           </View>
//         ) : null}

//         <TextInput
//           style={[styles.input, error && styles.errorInput]}
//           autoCapitalize="none"
//           value={emailAddress}
//           placeholder="Enter email"
//           placeholderTextColor="#9A8478"
//           onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
//         />

//         <TextInput
//           style={[styles.input, error && styles.errorInput]}
//           value={password}
//           placeholder="Enter password"
//           placeholderTextColor="#9A8478"
//           secureTextEntry={true}
//           onChangeText={(password) => setPassword(password)}
//         />

//         <TouchableOpacity style={styles.button} onPress={onSignInPress}>
//           <Text style={styles.buttonText}>Sign In</Text>
//         </TouchableOpacity>

//         <View style={styles.footerContainer}>
//           <Text style={styles.footerText}>Don&apos;t have an account?</Text>

//           <Link href="/sign-up" asChild>
//             <TouchableOpacity>
//               <Text style={styles.linkText}>Sign up</Text>
//             </TouchableOpacity>
//           </Link>
//         </View>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// }

// new
// import { useSignIn } from "@clerk/clerk-expo";
// import { Link, useRouter } from "expo-router";
// import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
// import { useState } from "react";
// import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
// import { styles } from "@/assets/styles/auth.styles";
// import { Ionicons } from "@expo/vector-icons";
// import { COLORS } from "../../constants/colors";

// export default function Page() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = useState("");
//   const [password, setPassword] = useState("");
//   const [code, setCode] = useState("");
//   const [error, setError] = useState("");
//   const [displaySecondFactor, setDisplaySecondFactor] = useState(false);

//   // 1. Handle standard Sign In (Email & Password)
//   const onSignInPress = async () => {
//     if (!isLoaded) return;
//     setError("");

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       if (signInAttempt.status === "complete") {
//         await setActive({ session: signInAttempt.createdSessionId });
//         router.replace("/");
//       } else if (signInAttempt.status === "needs_second_factor") {
//         const emailFactor = signInAttempt.supportedSecondFactors.find(
//           (f) => f.strategy === "email_code",
//         );

//         if (emailFactor) {
//           await signIn.prepareSecondFactor({
//             strategy: "email_code",
//             emailAddressId: emailFactor.emailAddressId,
//           });
//           setDisplaySecondFactor(true);
//         } else {
//           setError("Second factor authentication method not supported.");
//         }
//       } else {
//         console.error(JSON.stringify(signInAttempt, null, 2));
//       }
//     } catch (err) {
//       console.log(err.errors);
//       if (err.errors?.[0]?.code === "form_password_incorrect") {
//         setError("Password is incorrect. Please try again.");
//       } else {
//         setError(
//           err.errors?.[0]?.message || "An error occurred. Please try again.",
//         );
//       }
//     }
//   };

//   // 2. Handle the 2FA / OTP Verification submission
//   const onVerifySecondFactorPress = async () => {
//     if (!isLoaded) return;
//     setError("");

//     try {
//       const result = await signIn.attemptSecondFactor({
//         strategy: "email_code",
//         code: code,
//       });

//       if (result.status === "complete") {
//         await setActive({ session: result.createdSessionId });
//         router.replace("/");
//       } else {
//         console.error(JSON.stringify(result, null, 2));
//       }
//     } catch (err) {
//       console.log(err.errors);
//       setError(err.errors?.[0]?.message || "Incorrect verification code.");
//     }
//   };

//   return (
//     <KeyboardAwareScrollView
//       style={{ flex: 1 }}
//       contentContainerStyle={{ flexGrow: 1 }}
//       bottomOffset={50}
//     >
//       <View style={styles.container}>
//         <Image
//           source={require("../../assets/images/revenue-i4.png")}
//           style={styles.illustration}
//         />

//         {/* Dynamic Title based on current login phase */}
//         <Text style={styles.title}>
//           {displaySecondFactor ? "Enter Security Code" : "Welcome Back"}
//         </Text>

//         {error ? (
//           <View style={styles.errorBox}>
//             <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
//             <Text style={styles.errorText}>{error}</Text>
//             <TouchableOpacity onPress={() => setError("")}>
//               <Ionicons name="close" size={20} color={COLORS.textLight} />
//             </TouchableOpacity>
//           </View>
//         ) : null}

//         {/* STEP 1: Render standard Username and Password Inputs */}
//         {!displaySecondFactor ? (
//           <>
//             <TextInput
//               style={[styles.input, error && styles.errorInput]}
//               autoCapitalize="none"
//               value={emailAddress}
//               placeholder="Enter email"
//               placeholderTextColor="#9A8478"
//               onChangeText={(text) => setEmailAddress(text)}
//             />

//             <TextInput
//               style={[styles.input, error && styles.errorInput]}
//               value={password}
//               placeholder="Enter password"
//               placeholderTextColor="#9A8478"
//               secureTextEntry={true}
//               onChangeText={(text) => setPassword(text)}
//             />

//             <TouchableOpacity style={styles.button} onPress={onSignInPress}>
//               <Text style={styles.buttonText}>Sign In</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           /* STEP 2: Render 2FA Code Input Box */
//           <>
//             <Text
//               style={{
//                 color: "#9A8478",
//                 marginBottom: 15,
//                 textAlign: "center",
//                 fontSize: 14,
//               }}
//             >
//               Clerk detected a login from a new device. We sent a code to **
//               {emailAddress}**.
//             </Text>

//             <TextInput
//               style={[
//                 styles.input,
//                 error && styles.errorInput,
//                 {
//                   letterSpacing: 4,
//                   textAlign: "center",
//                   fontSize: 18,
//                   fontWeight: "bold",
//                 },
//               ]}
//               value={code}
//               placeholder="0 0 0 0 0 0"
//               placeholderTextColor="#9A8478"
//               keyboardType="number-pad"
//               maxLength={6}
//               onChangeText={(text) => setCode(text)}
//             />

//             <TouchableOpacity
//               style={styles.button}
//               onPress={onVerifySecondFactorPress}
//             >
//               <Text style={styles.buttonText}>Verify Code</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={{ marginTop: 15, alignItems: "center" }}
//               onPress={() => setDisplaySecondFactor(false)}
//             >
//               <Text
//                 style={[styles.linkText, { textDecorationLine: "underline" }]}
//               >
//                 Back to Sign In
//               </Text>
//             </TouchableOpacity>
//           </>
//         )}

//         <View style={styles.footerContainer}>
//           <Text style={styles.footerText}>Don&apos;t have an account?</Text>
//           <Link href="/sign-up" asChild>
//             <TouchableOpacity>
//               <Text style={styles.linkText}>Sign up</Text>
//             </TouchableOpacity>
//           </Link>
//         </View>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// }

// updated

// updated
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { styles } from "@/assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [displaySecondFactor, setDisplaySecondFactor] = useState(false);

  // Countdown timer states
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const countdownRef = useRef(30);
  const timerRef = useRef(null);

  // Manage the countdown interval timer without retriggering on every tick
  useEffect(() => {
    if (!displaySecondFactor) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      countdownRef.current = 30;
      setCountdown(30);
      setCanResend(false);
      return;
    }

    countdownRef.current = 30;
    setCountdown(30);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      setCountdown(countdownRef.current);

      if (countdownRef.current <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setCanResend(true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [displaySecondFactor]);

  // Helper to safely trigger the code delivery to user's email
  const sendVerificationCode = async (factorList) => {
    const emailFactor = factorList.find((f) => f.strategy === "email_code");
    if (emailFactor) {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });
      // Reset timer mechanics
      setCountdown(30);
      setCanResend(false);
      setDisplaySecondFactor(true);
    } else {
      setError("Second factor authentication method not supported.");
    }
  };

  // 1. Handle standard Sign In (Email & Password)
  const onSignInPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else if (signInAttempt.status === "needs_second_factor") {
        await sendVerificationCode(signInAttempt.supportedSecondFactors);
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else {
        setError(
          err.errors?.[0]?.message || "An error occurred. Please try again.",
        );
      }
    }
  };

  // 2. Handle Resending the OTP Code
  const onResendPress = async () => {
    if (!isLoaded || !canResend) return;
    setError("");
    try {
      // Re-fetch the current sign-in state to pull supported factors safely
      await sendVerificationCode(signIn.supportedSecondFactors);
    } catch (err) {
      setError(err.errors?.[0]?.message || "Failed to resend the code.");
    }
  };

  // 3. Handle the 2FA / OTP Verification submission
  const onVerifySecondFactorPress = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (err) {
      setError(err.errors?.[0]?.message || "Incorrect verification code.");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      bottomOffset={50}
    >
      <View style={styles.container}>
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Ionicons name="wallet-outline" size={30} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>
            {displaySecondFactor ? "Enter Security Code" : "Welcome Back"}
          </Text>
          <Text style={styles.subtitle}>
            {displaySecondFactor
              ? "We sent a one-time code to your inbox for extra protection."
              : "Sign in to keep your money moves organized and effortless."}
          </Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>Secure</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>Instant</Text>
            </View>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>Smart</Text>
            </View>
          </View>
        </View>

        <View style={styles.formCard}>
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => setError("")}>
                <Ionicons name="close" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* STEP 1: standard Identity Fields */}
          {!displaySecondFactor ? (
            <>
              <TextInput
                style={[styles.input, error && styles.errorInput]}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter email"
                placeholderTextColor={COLORS.muted}
                onChangeText={(text) => setEmailAddress(text)}
              />

              <View style={styles.passwordFieldContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    error && styles.errorInput,
                  ]}
                  value={password}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.muted}
                  secureTextEntry={!showPassword}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.muted}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </>
          ) : (
            /* STEP 2: Safe OTP Input Field + Resend Mechanics */
            <>
              <Text style={styles.verificationHintText}>
                Clerk detected a login from a new device. We sent a code to{" "}
                {emailAddress}.
              </Text>

              <TextInput
                style={[
                  styles.input,
                  error && styles.errorInput,
                  {
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "bold",
                    // Fixes the layout bug: letterSpacing applies ONLY when user types numbers!
                    letterSpacing: code.length > 0 ? 8 : 0,
                  },
                ]}
                value={code}
                placeholder="Enter 6-digit code"
                placeholderTextColor={COLORS.muted}
                keyboardType="number-pad"
                maxLength={6}
                onChangeText={(text) => setCode(text)}
              />

              {/* Countdown / Resend UI Actions */}
              <View style={{ marginBottom: 20, alignItems: "center" }}>
                {canResend ? (
                  <TouchableOpacity onPress={onResendPress}>
                    <Text style={styles.resendText}>
                      Resend Verification Code
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendHintText}>
                    Resend code in{" "}
                    <Text style={styles.resendHintAccent}>{countdown}s</Text>
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={onVerifySecondFactorPress}
              >
                <Text style={styles.buttonText}>Verify Code</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 15, alignItems: "center" }}
                onPress={() => {
                  setDisplaySecondFactor(false);
                  setCode("");
                  setCanResend(false);
                  setCountdown(30);
                }}
              >
                <Text
                  style={[styles.linkText, { textDecorationLine: "underline" }]}
                >
                  Back to Sign In
                </Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
