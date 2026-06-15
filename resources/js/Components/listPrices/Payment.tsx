import { useEffect } from 'react';
import styles from '../../../assets/listPrices/payment.module.scss'
import axios from 'axios';
import { PaymentsLicense } from '../../services/paymantLicense';
import { ToastContainer, toast } from 'react-toastify';
declare global {
    interface Window {
      paypal: any;
    }
}
export default function Payment({fiscalIdentification,email}:{email?: string,fiscalIdentification?:string}) {
const {
    formPayment,loaded,
    paid,setLoaded,setPaid,
    handlerChangeInput,dataAtribuite,
    product,handlerSubmitForm} = PaymentsLicense({fiscalIdentification,email})

  useEffect(()=>{
    (()=>{
      if (formPayment.nif.length > 0 && formPayment.email.length > 0) {
        axios.post('http://bosgc.sisgesc.net/api/RequestAmount',{
          ...formPayment
      },{
          headers: {
              Authorization: 'oEn34JE6gDfVuZlR6QRWX8Q2byn9repjspVFWoz2SZdncBYePGc7XoKZ8Noo',
          }
      }).then((response) => {
        if (response.data.client) {
          return dataAtribuite(response)
        }
        toast.warn('Dados não encontrado, por favor verifica os dados e tenta novamente ',{position: "top-right"})
        }).catch((err) => {
          console.log(err);
        });
      }
    })()

    const id = 'ATht4B6eiCPEp4ptAOiP9JomI_40q97GWyoykjcHRDJTAtRJdqq0Oo-A9k1EQEk-DNjrmbctA0pvAtXN';
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${id}`;
    script.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(script);
    return () => {
      const paypalButtonContainer = document.getElementById('paypal-button-container');
      if (paypalButtonContainer) {
        paypalButtonContainer.innerHTML = '';
      }
    };
  },[])

  useEffect(() => {
    const paypalButtonContainer = document.getElementById('paypal-button-container');
    if (paypalButtonContainer) {
      paypalButtonContainer.innerHTML = '';
    }
    if (loaded && !paid) {
      function loadButtonAndLogicAboutPayment() {
        setTimeout(() => {
          window.paypal
            .Buttons({
              createOrder: (data:any, actions:any) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: product.description,
                      amount: {
                        currency_code: 'USD',
                        value: product.price,
                      },
                    },
                  ],
                });
              },
              onApprove: async (_, actions) => {
                const order = await actions.order.capture();
                setPaid(true);
                console.log(order);
              },
            })
            .render('#paypal-button-container');
        });
      }
      loadButtonAndLogicAboutPayment();
    }
  }, [loaded, paid,product]);

  return (
    <div className={`${styles.main} mt-20`}>
      <ToastContainer/>
      <div className={styles.principal}>
        <div className={styles.form}>
          <form onSubmit={handlerSubmitForm} action='http://bosgc.sisgesc.net/api/RequestAmount'>
            <span className={styles.box}>
              <label htmlFor="email">Email:</label>
              <input type="email" id='email' value={formPayment.email} onChange={(e)=>handlerChangeInput(e.target.id,e.target.value)} placeholder='Digite seu email'/>
            </span>
            <span className={styles.box}>
              <label htmlFor="nif">Nif:</label>
              <input type="text" id='nif' value={formPayment.nif} onChange={(e)=>handlerChangeInput(e.target.id,e.target.value)} placeholder='Digite seu numero de identificação fiscal'/>
              <button type={'submit'}>Buscar</button>
            </span>

          </form>
           {
            paid ? (
              <div>Parabems voce comprou o produto</div>
            ): (

              <div>
                {
                  product.price !=0 &&(
                    <div>
                      <div>
                        <h3>Plano {product.description}</h3>
                      </div>
                      <div>
                        <span>Total: {product.total+' 00Kz'}</span>
                        <span>Disconto: {product.discount+' 00Kz'} </span>
                        <span>A pagar: {product.price+' 00Kz'} </span>
                      </div>
                    </div>
                  )
                }
                <div id='paypal-button-container'></div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
