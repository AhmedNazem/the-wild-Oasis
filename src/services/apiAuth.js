import { supabase, supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fullName,
        avatar: "",
      },
    },
  });
  if (error) throw new Error(error.message);
  console.log(data);
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  console.log(data);
  return data;
}
//
//
//
// export async function getCurrentUser() {
//   const { data: session } = await supabase.auth.getSession();
//   if (!session.session) return null;

//   const { data, error } = await supabase.auth.getUser();
//   console.log(data);
//   if (error) throw new Error(error.message);
//   return data?.user;
// }
export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data: userData, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  console.log(userData.user?.user_metadata); // Ensure it has the expected data

  return userData?.user;
}

//* checked
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // Step 1: Update password or fullName
  let updateFields = {};
  if (password) updateFields.password = password;
  if (fullName) updateFields.data = { fullName };

  const { data, error } = await supabase.auth.updateUser(updateFields);
  if (error) throw new Error(error.message);

  if (!avatar) return data;

  // Step 2: Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Date.now()}`;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);

  // Step 3: Update the avatar URL
  const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: { avatar: avatarUrl },
  });
  if (error2) throw new Error(error2.message);

  return updatedUser;
}
