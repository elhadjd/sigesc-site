import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { BiMap, BiPhone, BiEnvelope } from "react-icons/bi";
import { motion } from "framer-motion";
import { BsWhatsapp } from "react-icons/bs";
import { useForm } from "@inertiajs/react";
import { toast, ToastContainer } from "react-toastify";
import { L as LoadingButtons } from "./loadingButtons-CO2cJ9-s.js";
import "react-icons/vsc";
const whatsApp = "_whatsApp_83wsf_1";
const animate = "_animate_83wsf_1";
const styles = {
  whatsApp,
  animate
};
function WhatsApp() {
  return /* @__PURE__ */ jsx("div", { className: styles.whatsApp, children: /* @__PURE__ */ jsxs("a", { href: "https://wa.me/+244929147445", target: "_blank", children: [
    /* @__PURE__ */ jsx(BsWhatsapp, {}),
    "WhatsApp"
  ] }) });
}
const contactsServices = () => {
  const [buttonSubmitDisable, setButtonSubmitDisable] = useState(false);
  const { data, setData, reset, post, hasErrors, wasSuccessful, processing, errors } = useForm({
    surname: "",
    name: "",
    phone: "",
    email: "",
    message: "",
    newsletter: false,
    account: false
  });
  const handelSubmitForm = (event) => {
    if (buttonSubmitDisable)
      return;
    event.preventDefault();
    if (buttonSubmitDisable)
      return toast.info("Formulario enviado", { position: "top-right" });
    post("/contact/sendMessage", { onSuccess: () => reset(), onError: (errors2) => {
      console.log(errors2);
      toast.error("Erro ao enviar o formulario, verifique os campos e tente novamente", { position: "top-right" });
    } });
  };
  return { setData, data, errors, wasSuccessful, hasErrors, handelSubmitForm, processing };
};
function Contacts({ compact = false, showTitle = true }) {
  const { data, handelSubmitForm, setData, wasSuccessful, processing, errors: formErrors } = contactsServices();
  useEffect(() => {
    if (wasSuccessful) {
      toast.success("Email enviado com sucesso!", {
        position: "top-right",
        autoClose: 3e3
      });
    }
  }, [wasSuccessful]);
  if (compact) {
    return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [
      showTitle && /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-6 text-center", children: [
        "Formulário de ",
        /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "Contato" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            ContactInfoItem,
            {
              icon: /* @__PURE__ */ jsx(BiMap, { className: "text-xl text-blue-600" }),
              title: "Escritório",
              content: "Newark, NJ, Estados Unidos"
            }
          ),
          /* @__PURE__ */ jsx(
            ContactInfoItem,
            {
              icon: /* @__PURE__ */ jsx(BiPhone, { className: "text-xl text-green-600" }),
              title: "Telefones",
              content: /* @__PURE__ */ jsxs(Fragment, { children: [
                "+1 9735249725 (EUA)",
                /* @__PURE__ */ jsx("br", {}),
                "+244 929147445 (Angola)"
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            ContactInfoItem,
            {
              icon: /* @__PURE__ */ jsx(BiEnvelope, { className: "text-xl text-purple-600" }),
              title: "E-mail",
              content: "comercial.sisgesc@gmail.com"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(WhatsApp, {}) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-sm border border-gray-200", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Envie uma mensagem" }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handelSubmitForm, className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsx(
                InputComponent,
                {
                  id: "name",
                  label: "Nome",
                  placeholder: "Seu nome",
                  setData: (e) => setData("name", e),
                  type: "text",
                  value: data.name,
                  error: formErrors.name,
                  compact: true
                }
              ),
              /* @__PURE__ */ jsx(
                InputComponent,
                {
                  id: "surname",
                  label: "Apelido",
                  placeholder: "Seu apelido",
                  setData: (e) => setData("surname", e),
                  type: "text",
                  value: data.surname,
                  error: formErrors.surname,
                  compact: true
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              InputComponent,
              {
                id: "email",
                label: "E-mail",
                placeholder: "seu@email.com",
                setData: (e) => setData("email", e),
                type: "email",
                value: data.email,
                error: formErrors.email,
                compact: true
              }
            ),
            /* @__PURE__ */ jsx(
              InputComponent,
              {
                id: "phone",
                label: "Telefone",
                placeholder: "(XX) XXXXX-XXXX",
                setData: (e) => setData("phone", e),
                type: "tel",
                value: data.phone,
                error: formErrors.phone,
                compact: true
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-1", children: "Mensagem" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "message",
                  name: "message",
                  className: "w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm",
                  rows: 3,
                  value: data.message,
                  onChange: (e) => setData("message", e.target.value),
                  required: true,
                  placeholder: "Como podemos ajudar?"
                }
              ),
              formErrors.message && /* @__PURE__ */ jsx("span", { className: "text-red-600 text-xs mt-1", children: formErrors.message })
            ] }),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.02 },
                whileTap: { scale: 0.98 },
                className: "w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm disabled:opacity-50",
                type: "submit",
                disabled: processing,
                children: processing ? /* @__PURE__ */ jsx(LoadingButtons, {}) : "Enviar Mensagem"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(ToastContainer, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [
    showTitle && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        className: "text-center mb-8",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: [
            "Formulário de ",
            /* @__PURE__ */ jsx("span", { className: "text-blue-600", children: "Contato" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Estamos aqui para ajudar sua empresa a crescer" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          ContactInfoItem,
          {
            icon: /* @__PURE__ */ jsx(BiMap, { className: "text-2xl text-blue-600" }),
            title: "Nosso Escritório",
            content: "Newark, NJ, Estados Unidos",
            description: "Horário comercial: Seg-Sex, 8h-18h (EST)"
          }
        ),
        /* @__PURE__ */ jsx(
          ContactInfoItem,
          {
            icon: /* @__PURE__ */ jsx(BiPhone, { className: "text-2xl text-green-600" }),
            title: "Telefones",
            content: /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("p", { children: "+1 9735249725 (EUA)" }),
              /* @__PURE__ */ jsx("p", { children: "+244 929147445 (Angola)" })
            ] }),
            description: "Atendimento em inglês e português"
          }
        ),
        /* @__PURE__ */ jsx(
          ContactInfoItem,
          {
            icon: /* @__PURE__ */ jsx(BiEnvelope, { className: "text-2xl text-purple-600" }),
            title: "E-mail",
            content: "comercial.sisgesc@gmail.com",
            description: "Respondemos em até 24 horas"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsx(WhatsApp, {}) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-lg shadow-md border border-gray-200", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Envie uma Mensagem" }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handelSubmitForm, className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(
              InputComponent,
              {
                id: "name",
                label: "Nome",
                placeholder: "Seu nome completo",
                setData: (e) => setData("name", e),
                type: "text",
                value: data.name,
                error: formErrors.name
              }
            ),
            /* @__PURE__ */ jsx(
              InputComponent,
              {
                id: "surname",
                label: "Apelido",
                placeholder: "Seu apelido",
                setData: (e) => setData("surname", e),
                type: "text",
                value: data.surname,
                error: formErrors.surname
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            InputComponent,
            {
              id: "email",
              label: "E-mail",
              placeholder: "seu@email.com",
              setData: (e) => setData("email", e),
              type: "email",
              value: data.email,
              error: formErrors.email
            }
          ),
          /* @__PURE__ */ jsx(
            InputComponent,
            {
              id: "phone",
              label: "Telefone",
              placeholder: "(XX) XXXXX-XXXX",
              setData: (e) => setData("phone", e),
              type: "tel",
              value: data.phone,
              error: formErrors.phone
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-2", children: "Mensagem" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "message",
                name: "message",
                className: "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                rows: 4,
                value: data.message,
                onChange: (e) => setData("message", e.target.value),
                required: true,
                placeholder: "Descreva como podemos ajudá-lo..."
              }
            ),
            formErrors.message && /* @__PURE__ */ jsx("span", { className: "text-red-600 text-sm mt-1", children: formErrors.message })
          ] }),
          /* @__PURE__ */ jsx(
            motion.button,
            {
              whileHover: { scale: 1.02 },
              whileTap: { scale: 0.98 },
              className: "w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50",
              type: "submit",
              disabled: processing,
              children: processing ? /* @__PURE__ */ jsx(LoadingButtons, {}) : "Enviar Mensagem"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ToastContainer, {})
  ] });
}
function ContactInfoItem({ icon, title, content, description }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      whileHover: { scale: 1.02 },
      className: "flex items-start bg-gray-50 p-4 rounded-lg",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mr-4 flex-shrink-0", children: icon }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900", children: title }),
          /* @__PURE__ */ jsx("div", { className: "text-gray-700 mt-1", children: content }),
          description && /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: description })
        ] })
      ]
    }
  );
}
function InputComponent(props) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { htmlFor: props.id, className: "block text-sm font-medium text-gray-700 mb-1", children: props.label }),
    /* @__PURE__ */ jsx(
      "input",
      {
        type: props.type,
        id: props.id,
        className: `w-full ${props.compact ? "p-2 text-sm" : "p-3"} border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`,
        value: props.value,
        onChange: (e) => props.setData(e.target.value),
        placeholder: props.placeholder,
        required: true
      }
    ),
    props.error && /* @__PURE__ */ jsx("span", { className: "text-red-600 text-xs mt-1", children: props.error })
  ] });
}
export {
  Contacts as default
};
