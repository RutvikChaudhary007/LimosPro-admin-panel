import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';

// Import Form UI components from shadcn/ui
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { constant } from "@/lib/constant";
import { toast } from "sonner"
import { login } from "@/api/login";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
      password: "",
      email: ""
    }
  });
  // const userRole = localStorage.getItem("user");
  // if(["Admin","Seo","Affiliate"].includes(userRole)){
  //   navigate(constant.ROUTING_URLS.DASHBOARD)
  // }const [open, setOpen] = React.useState(false);
	//  const loginMutation = useMutation({
  //     mutationFn: login,
  //     onSuccess: (response,variables) => {
  //       const token = response?.data?.accessToken;
  //       const user = response?.data;
  //       console.log('user====>',response)
  //       if(user?.)
  //       if(user?.roles){
  //         navigate(constant.ROUTING_URLS.DASHBOARD);
  //         // toast({
  //         //   title: "Unauthorized login",
  //         //   description: `Oops! This section is for super admins only. Please log in with an super admin account.`,
  //         //   variant: "destructive"
  //         // });
  //         return;
  //       }
  //       // setUser(user, token);
  //       const staySignedInMessage = variables.staySignedIn ? 'You will stay signed in' : 'You will be logged out after session expires';
      
  //     // toast({
  //     //   title: "Login successful",
  //     //   description: `Welcome back! ${staySignedInMessage}`,
  //     // });
  //       navigate('/postmanadm');
  //     },
  //     onError: (err: unknown) => {
      
  //       let errorMessage = 'An unexpected error occurred';
      
  //       if (err && typeof err === 'object' && 'isAxiosError' in err) {
  //         const axiosError = err as AxiosError<ApiErrorResponse>;
  //         errorMessage = axiosError.response?.data?.message || errorMessage;
  //       }
  //       if(errorMessage==="Request failed with status code 429") return;
  //     //   toast({
  //     //   title: "Login failed",
  //     //   description: errorMessage,
  //     //   variant: "destructive"
  //     // });
  //       // setError(errorMessage);
  //     }
  //   });
  const onSubmit = async (data: LoginFormValues) => {
    toast("Event has been created.",)
    toast("Logged in successfull")
    // delete data.remember;
    // return await loginMutation.mutateAsync(data);
    return new Promise(res => setTimeout(() => {
      console.log(data);
      res("ok");
      form.reset();
      if(data.email === "admin@email.com"){
        localStorage.setItem("role","Super Admin")
        navigate(constant.ROUTING_URLS.DASHBOARD)
      }else if(data.email === "affiliate@email.com"){
        localStorage.setItem("role","Affiliate")
        navigate(constant.ROUTING_URLS.DASHBOARD)
      }else if(data.email === "seo@email.com"){
        localStorage.setItem("role","Seo")
        navigate(constant.ROUTING_URLS.CONTENT_MANAGEMENT_ALL_PAGES)
      }
      
    }, 1000));
  };

  return (
    <div className="flex items-center justify-center h-screen min-h-screen ">
      
      <div className="w-[597px] h-[618px] min-w-[597px] min-h-[618px] flex flex-col gap-[63px] shadow-lg shadow-[#F1F1F1] rounded-[6px]">
        <div style={{ background: "#F1F1F1" }} className="min-w-full h-[146px] pl-8 pr-8 w-full flex gap-[231px] rounded-t-[6px]">
          <div className="flex flex-col mt-8 items-start gap-3 w-[195px] h-[61px]">
            <p className="w-full font-['Akatab'] font-medium text-xl  text-black h-[27px]">Welcome Back!</p>
            <p className="w-full font-['Akatab'] font-medium text-[#3A3A3A] h-[22px]">Sign in to continue to CMS.</p>
          </div>
          <div className="w-[74px] h-[58px] mt-11 mb-11">
            <img src={`/ProfilePic.jpg`} className="w-full h-full object-cover" alt="profile pic" />
          </div>
        </div>

        {/* Use shadcn ui's Form wrapper and pass react-hook-form instance */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative px-8">

            {/* Logo / Header above form */}
            <div className=" bg-[#FAFAFA] absolute w-[195px] h-[72px] p-5 -top-[99px] rounded z-50 shadow-inner shadow-[#E7E7E7] ">
              <div className="flex gap-2 w-[140px] h-8">
                <img src="/LoginLogo.jpg" alt="logo" className="w-full h-full object-cover" />
                <img src="/Frame.jpg" alt="logo" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="w-[533px] h-[377px]">

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="mb-5">
                    <FormLabel htmlFor="email" className="font-['Akatab']">Email</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" type="email" placeholder="name@email.com" className="h-[54px] rounded font-['Akatab']" />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="relative mb-5">
                    <FormLabel htmlFor="password" className="">Password</FormLabel>
                    <FormControl>
                      <Input {...field} id="password" type={showPassword ? "text" : "password"} className="h-[54px] rounded font-['Akatab']" />
                    </FormControl>
                    <img
                      className="absolute right-[21px] top-[44px] w-4 h-4 min-h-4 min-w-4 cursor-pointer"
                      src={showPassword ? '/eye.svg' : '/eye-off.svg'}
                      alt="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Remember Me Checkbox */}
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2.5 mt-8 h-[19px] cursor-pointer">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        ref={field.ref}
                        id="remember"
                        className="data-[state=checked]:bg-[#d6d6d6] data-[state=checked]:border-[#d6d6d6] [&_[data-state=checked]>svg]:w-2.5 [&_[data-state=checked]>svg]:h-2.5 [&_[data-state=checked]>svg]:text-[#5A5A5A]"
                      />
                    </FormControl>
                    <FormLabel htmlFor="remember" className="text-sm font-['Akatab'] text-[#5A5A5A] cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex h-[46px] mt-[34px] w-full items-center justify-center gap-2.5 rounded ">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-full pl-6 pr-6 pt-5 pb-5 text-[#515151] font-['Akatab'] font-medium hover:text-white bg-[#E4E4E4] cursor-pointer"
                >
                  {form.formState.isSubmitting ? "Loading..." : "Log In"}
                </Button>
              </div>

              {/* Forgot Password */}
              <div className="flex mt-[34px] h-5 items-center justify-center gap-2.5">
                <img src="/lock-closed.jpg" className="h-full" alt="lock" />
                <p className="text-sm text-[#5A5A5A] font-['Akatab']">
                  <Link to={"#"}>Forgot Password?</Link>
                </p>
              </div>

            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default AdminLoginPage;
