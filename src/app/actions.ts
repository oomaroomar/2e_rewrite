"use server";

export async function getFullName(data: FormData) {
  // we're gonna put a delay in here to simulate some kind of data processing like persisting data
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("server action", data);

  //   return new Promise((resolve) => {
  //     resolve({
  //       status: "success",
  //       message: `Nice`,
  //     });
  //   });
}
