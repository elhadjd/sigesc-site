import { jsxs, jsx } from "react/jsx-runtime";
import { H as HeaderComponent, F as FooterComponent } from "./Header-CTrR7x_e.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { u as useFormState, F as FormStateProvider } from "./stateForm-DYypFJ1f.js";
import { U as UserLoggedProvider } from "./loggedUser-Dauubd9z.js";
import "react-icons/ai";
import "react-icons/bi";
import "react-icons/bs";
import "react-icons/fa";
import "@inertiajs/react";
import "framer-motion";
import "./index-DJUNAe3r.js";
import "react-icons/fa6";
import "react-icons/ri";
import "react-icons/fi";
const main = "_main_18li5_1";
const principal = "_principal_18li5_4";
const form = "_form_18li5_15";
const box = "_box_18li5_35";
const search = "_search_18li5_42";
const images = "_images_18li5_169";
const inputs = "_inputs_18li5_193";
const numberCard = "_numberCard_18li5_274";
const codeCardDate = "_codeCardDate_18li5_278";
const codeCard = "_codeCard_18li5_278";
const info = "_info_18li5_379";
const submit = "_submit_18li5_418";
const styles = {
  main,
  principal,
  form,
  box,
  search,
  images,
  inputs,
  numberCard,
  codeCardDate,
  codeCard,
  info,
  submit
};
const PaymentsLicense = ({ fiscalIdentification, email }) => {
  const { setIsFormSubmitted } = useFormState();
  const [formPayment, setFormPayment] = useState({
    email: email ? email : "",
    nif: fiscalIdentification ? fiscalIdentification : ""
  });
  const [product, setProduct] = useState({
    description: "",
    price: 0,
    total: 0,
    discount: 0
  });
  const [paid, setPaid] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const handlerChangeInput = (id, value) => {
    formPayment[id] = value;
    setFormPayment({ ...formPayment });
  };
  async function handlerSubmitForm(e) {
    e.preventDefault();
    setIsFormSubmitted(true);
    return await axios.post("https://bosgc.sisgesc.net/api/RequestAmount", {
      ...formPayment
    }, {
      headers: {
        Authorization: "oEn34JE6gDfVuZlR6QRWX8Q2byn9repjspVFWoz2SZdncBYePGc7XoKZ8Noo"
      }
    }).then((response) => {
      if (response.data.client) {
        return dataAtribuite(response);
      }
      toast.warn("Dados não encontrado, por favor verifica os dados e tenta novamente ");
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      setIsFormSubmitted(false);
    });
  }
  const dataAtribuite = (data) => {
    product.description = data.data.client.license.license_type.name;
    product.price = data.data.client.account_client[0].restPayable;
    product.total = data.data.client.account_client[0].total;
    product.discount = data.data.client.account_client[0].discount;
    setProduct({ ...product });
  };
  return { formPayment, paid, setPaid, loaded, setLoaded, dataAtribuite, handlerChangeInput, product, handlerSubmitForm };
};
function Payment({ fiscalIdentification, email }) {
  const {
    formPayment,
    loaded,
    paid,
    setLoaded,
    setPaid,
    handlerChangeInput,
    dataAtribuite,
    product,
    handlerSubmitForm
  } = PaymentsLicense({ fiscalIdentification, email });
  useEffect(() => {
    (() => {
      if (formPayment.nif.length > 0 && formPayment.email.length > 0) {
        axios.post("http://bosgc.sisgesc.net/api/RequestAmount", {
          ...formPayment
        }, {
          headers: {
            Authorization: "oEn34JE6gDfVuZlR6QRWX8Q2byn9repjspVFWoz2SZdncBYePGc7XoKZ8Noo"
          }
        }).then((response) => {
          if (response.data.client) {
            return dataAtribuite(response);
          }
          toast.warn("Dados não encontrado, por favor verifica os dados e tenta novamente ", { position: "top-right" });
        }).catch((err) => {
          console.log(err);
        });
      }
    })();
    const id = "ATht4B6eiCPEp4ptAOiP9JomI_40q97GWyoykjcHRDJTAtRJdqq0Oo-A9k1EQEk-DNjrmbctA0pvAtXN";
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${id}`;
    script.addEventListener("load", () => setLoaded(true));
    document.body.appendChild(script);
    return () => {
      const paypalButtonContainer = document.getElementById("paypal-button-container");
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = "";
      }
    };
  }, []);
  useEffect(() => {
    const paypalButtonContainer = document.getElementById("paypal-button-container");
    if (paypalButtonContainer) {
      paypalButtonContainer.innerHTML = "";
    }
    if (loaded && !paid) {
      let loadButtonAndLogicAboutPayment = function() {
        setTimeout(() => {
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: product.description,
                    amount: {
                      currency_code: "USD",
                      value: product.price
                    }
                  }
                ]
              });
            },
            onApprove: async (_, actions) => {
              const order = await actions.order.capture();
              setPaid(true);
              console.log(order);
            }
          }).render("#paypal-button-container");
        });
      };
      loadButtonAndLogicAboutPayment();
    }
  }, [loaded, paid, product]);
  return /* @__PURE__ */ jsxs("div", { className: `${styles.main} mt-20`, children: [
    /* @__PURE__ */ jsx(ToastContainer, {}),
    /* @__PURE__ */ jsx("div", { className: styles.principal, children: /* @__PURE__ */ jsxs("div", { className: styles.form, children: [
      /* @__PURE__ */ jsxs("form", { onSubmit: handlerSubmitForm, action: "http://bosgc.sisgesc.net/api/RequestAmount", children: [
        /* @__PURE__ */ jsxs("span", { className: styles.box, children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "email", children: "Email:" }),
          /* @__PURE__ */ jsx("input", { type: "email", id: "email", value: formPayment.email, onChange: (e) => handlerChangeInput(e.target.id, e.target.value), placeholder: "Digite seu email" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: styles.box, children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "nif", children: "Nif:" }),
          /* @__PURE__ */ jsx("input", { type: "text", id: "nif", value: formPayment.nif, onChange: (e) => handlerChangeInput(e.target.id, e.target.value), placeholder: "Digite seu numero de identificação fiscal" }),
          /* @__PURE__ */ jsx("button", { type: "submit", children: "Buscar" })
        ] })
      ] }),
      paid ? /* @__PURE__ */ jsx("div", { children: "Parabems voce comprou o produto" }) : /* @__PURE__ */ jsxs("div", { children: [
        product.price != 0 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h3", { children: [
            "Plano ",
            product.description
          ] }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Total: ",
              product.total + " 00Kz"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Disconto: ",
              product.discount + " 00Kz",
              " "
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "A pagar: ",
              product.price + " 00Kz",
              " "
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { id: "paypal-button-container" })
      ] })
    ] }) })
  ] });
}
function paymentsComponent(props, { fiscalIdentification, email }) {
  return /* @__PURE__ */ jsx(UserLoggedProvider, { children: /* @__PURE__ */ jsxs(FormStateProvider, { children: [
    /* @__PURE__ */ jsx(HeaderComponent, { auth: props.auth }),
    /* @__PURE__ */ jsx(Payment, { email, fiscalIdentification }),
    /* @__PURE__ */ jsx(FooterComponent, {})
  ] }) });
}
export {
  paymentsComponent as default
};
