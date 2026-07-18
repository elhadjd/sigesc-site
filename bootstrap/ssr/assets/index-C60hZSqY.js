import { jsx, jsxs } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { u as useLoggedUser, U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import { P as PreviewImage } from "./previewImage-DUYGizu3.js";
import { useEffect, useState } from "react";
import { r as routeApi } from "./index-DJUNAe3r.js";
import { u as useFormState, F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { toast } from "react-toastify";
import { BiCheck } from "react-icons/bi";
import { L as LoadingButtons } from "./loadingButtons-CO2cJ9-s.js";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import "react-icons/bs";
import "react-icons/fa";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
import "axios";
import "react-icons/vsc";
const UserServices = (local) => {
  const { setIsFormSubmitted } = useFormState();
  const { user, setUser } = useLoggedUser();
  const { RoutePost, RouteGet } = routeApi();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name == "country" || name == "phone" || name == "surname" || name == "address") {
      setUser({ ...user, user_profile: { ...user.user_profile, [name]: value } });
    } else {
      setUser({ ...user, [name]: value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    RoutePost(`${local}/editUserInfo/${user.id}`, { ...user }).then((response) => {
      toast[response.data.type](response.data.message, { position: "top-right" });
      if (response.data.type == "success")
        setUser({ ...response.data.data });
    }).catch((err) => {
      toast.error(err.response.data.message, { position: "top-right" });
      console.log(err);
    }).finally(() => {
      setIsFormSubmitted(false);
    });
  };
  const verifyUserEmail = () => {
    RouteGet(`${local}/notify-user-to-verify-email/${user.id}`).then((response) => {
      console.log(response.data);
    }).catch((err) => {
    });
  };
  return {
    verifyUserEmail,
    handleSubmit,
    handleInputChange
  };
};
function EditProfile({ Props, closeForEdit }) {
  const { handleSubmit, handleInputChange } = UserServices(Props.local);
  const { user, setUser } = useLoggedUser();
  const { image, onFileChange, setImage } = PreviewImage();
  const { isFormSubmitted } = useFormState();
  useEffect(() => {
    setUser({ ...Props.auth.user });
    setImage(Props.auth.user.user_profile.image);
  }, []);
  useEffect(() => {
    user.user_profile.image = image || null;
  }, [image]);
  return /* @__PURE__ */ jsx("div", { className: "max-w-screen-md mx-auto p-5 mt-24", children: /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Nome" }),
      /* @__PURE__ */ jsx("input", { type: "text", name: "nome", defaultValue: Props.auth.user.name, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Apelido" }),
      /* @__PURE__ */ jsx("input", { type: "text", name: "surname", defaultValue: Props.auth.user.user_profile.surname, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email" }),
      /* @__PURE__ */ jsxs("span", { className: "flex flex-row space-x-2 items-center", children: [
        /* @__PURE__ */ jsx("input", { type: "email", name: "surname", disabled: true, defaultValue: Props.auth.user.email, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" }),
        user.email_verified_at == null ? /* @__PURE__ */ jsx("button", { type: "button", children: "Verificar" }) : /* @__PURE__ */ jsx(BiCheck, { className: "text-3xl text-green-500" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Telefone" }),
      /* @__PURE__ */ jsx("input", { type: "text", name: "phone", defaultValue: Props.auth.user.user_profile.phone, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Pais" }),
      /* @__PURE__ */ jsx("input", { type: "text", name: "country", defaultValue: Props.auth.user.user_profile.country, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Morada" }),
      /* @__PURE__ */ jsx("input", { type: "text", name: "address", defaultValue: Props.auth.user.user_profile.address, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Editar imagem" }),
      /* @__PURE__ */ jsx("input", { type: "file", name: "imagemPerfil", onChange: onFileChange, className: "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" })
    ] }),
    Props.auth.user.user_profile.image && /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx("img", { src: image, alt: "Pré-visualização", className: "w-32 h-32 rounded-full" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row justify-around", children: [
      /* @__PURE__ */ jsx("button", { type: "submit", className: "px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700", style: { backgroundColor: "var(--buttonsColor)" }, children: isFormSubmitted ? /* @__PURE__ */ jsx(LoadingButtons, {}) : "Salvar Alterações" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: closeForEdit, className: "px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700", children: "Voltar" })
    ] })
  ] }) });
}
function ProfileComponent({ props, openForEdit }) {
  const { user, setUser } = useLoggedUser();
  UserServices(props.local);
  useEffect(() => {
    setUser({ ...props.auth.user });
  }, []);
  const services = [
    { name: "Gestão de PDV", description: "Melhore a eficiência das suas vendas.", icon: AiOutlineCheckCircle },
    { name: "Controle Financeiro", description: "Simplifique a emissão de faturas.", icon: AiOutlineCheckCircle },
    { name: "Gestão de Compras", description: "Otimize o seu processo de compra.", icon: AiOutlineCheckCircle }
  ];
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: "min-h-screen bg-gray-100 mt-8 p-6 flex flex-col items-center justify-center",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden p-5", children: /* @__PURE__ */ jsxs("div", { className: "md:flex", children: [
        /* @__PURE__ */ jsx("div", { className: "md:w-1/3 p-4 flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: props.auth.user.user_profile.image, alt: "Profile", className: "rounded-full border-2 border-gray-300 shadow-sm" }) }),
        /* @__PURE__ */ jsxs("div", { className: "md:w-2/3 p-4", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-bold mb-2", children: user == null ? void 0 : user.name }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: user == null ? void 0 : user.email }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap mb-4", children: services.map((service, index) => /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "w-full md:w-1/2 p-2",
              whileHover: { scale: 1.05 },
              transition: { type: "spring", stiffness: 300 },
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-center p-4 bg-gray-50 rounded-lg shadow", children: [
                /* @__PURE__ */ jsx(service.icon, { className: "text-2xl text-blue-500 mr-4" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: service.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: service.description })
                ] })
              ] })
            },
            index
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("button", { className: "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded", onClick: openForEdit, children: "Editar Perfil" }),
            /* @__PURE__ */ jsx(Link, { href: route("password.update-request"), className: "text-blue-500 hover:underline", children: "Mudar senha" })
          ] })
        ] })
      ] }) })
    }
  );
}
function ProfilePage(props) {
  const [stateForEdit, setStateFormEdit] = useState(false);
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    !stateForEdit ? /* @__PURE__ */ jsx(ProfileComponent, { openForEdit: () => setStateFormEdit(!stateForEdit), props }) : /* @__PURE__ */ jsx(EditProfile, { Props: props, closeForEdit: () => setStateFormEdit(!stateForEdit) }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  ProfilePage as default
};
