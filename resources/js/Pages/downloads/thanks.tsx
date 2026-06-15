import { HeaderComponent } from '@/Components/home/Header';
import { UserLoggedProvider } from '@/contexts/loggedUser';
import { FormStateProvider } from '@/contexts/stateForm';
import React from 'react';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa6';
import { Helmet } from "react-helmet";
import FooterComponent from '@/Components/home/Footer';

function DownloadThanks(props) {
    return (
        <UserLoggedProvider>
            <FormStateProvider>
                <HeaderComponent auth={props.auth} />
                <Helmet>
                    <script type="text/javascript">
                        {`
          _linkedin_partner_id = "6855762";
          window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
          window._linkedin_data_partner_ids.push(_linkedin_partner_id);
        `}
                    </script>
                    <script type="text/javascript">
                        {`
          (function(l) {
            if (!l) {
              window.lintrk = function(a, b) {
                window.lintrk.q.push([a, b]);
              };
              window.lintrk.q = [];
            }
            var s = document.getElementsByTagName("script")[0];
            var b = document.createElement("script");
            b.type = "text/javascript";
            b.async = true;
            b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
            s.parentNode.insertBefore(b, s);
          })(window.lintrk);
        `}
                    </script>
                    <noscript>
                        {`
          <img
            height="1"
            width="1"
            style="display:none;"
            alt=""
            src="https://px.ads.linkedin.com/collect/?pid=6855762&fmt=gif"
          />
        `}
                    </noscript>
                </Helmet>
                <div className="bg-gradient-to-br from-blue-50 to-purple-100 flex items-center h-full overflow-y-auto pt-16 justify-center px-4">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center my-4">
                        <div className="flex justify-center mb-6">
                            <img
                                src="https://admin.sisgesc.net/favicon.ico" // Substitua pelo logo do SIGESC
                                alt="Logo SIGESC"
                                className="w-24 h-24 animate-bounce"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Obrigado por baixar o SIGESC! 🎉
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Agradecemos por escolher o SIGESC para gerenciar seu negocio. Estamos aqui para ajudar você a alcançar seus objetivos de forma eficiente e moderna.
                        </p>
                        <div className="mt-8 text-sm text-gray-500">
                            <p>
                                Siga-nos nas redes sociais:
                            </p>
                            <div className="flex justify-center space-x-4 mt-2">
                                <a href="#" className="text-gray-500 hover:text-blue-500">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-purple-500">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-blue-400">
                                    <FaLinkedin />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <FooterComponent />

            </FormStateProvider>
        </UserLoggedProvider>
    );
}

export default DownloadThanks;
