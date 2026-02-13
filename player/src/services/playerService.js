export async function getPlayerInfo() {
  const token = localStorage.getItem("token");  

  if (!token) {
    throw new Error("No token found");
  }

  const response = await fetch(
    "http://turfytesting.runasp.net/Turfy/GetPlayerInfoEndPoint/GetInfo",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
     
  if (response.status === 401) {
    throw new Error("Unauthorized – token expired");
  }

  const json = await response.json();

  if (!json.isSuccess) {
    throw new Error(json.errorCode || "Server error");
  }
  console.log("GetPlayerInfo RAW RESPONSE:", json);
  return json.data;
}

//  update profile function

export async function updatePlayerProfile(fullName, imageFile) {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No token found");

  // تجهيز البيانات كـ FormData لأن السيرفر يتوقع [FromForm]
  const formData = new FormData();
  formData.append("FullName", fullName);
  if (imageFile) {
    formData.append("Image", imageFile); // "Image" يجب أن يطابق اسم الحقل في الـ VM
  }

  const response = await fetch(
    "http://turfytesting.runasp.net/Turfy/UpdatePlayerProfileEndpoint/UpdateProfile",
    {
      method: "PATCH", // كما هو محدد في الـ Endpoint
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Bearer ${token}`,
       
      },
      body: formData,
    }
  );

  const json = await response.json();

  if (!json.isSuccess) {
    throw new Error(json.message || "Failed to update profile");
  }

  return json;
}