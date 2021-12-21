<template>
  <div class="login_wrap" id="bg">
    <canvas></canvas>
    <canvas></canvas>
    <canvas></canvas>
    <div class="sys_top">
      <img class="sys_logo" src="@/assets/img/login/logo.png" alt="">
      <div class="sys_name">投资云地图</div>
    </div>
    <!-- 登录 -->
    <div class="login-box" v-show="!isRegister&&!isFind">
      <h2 style="margin-bottom:10px;">登录</h2>
      <el-form label-position="top" class="login_form">
        <el-form-item label="手机号" style="margin-bottom:0;">
          <el-input v-model="user.username" type="text" placeholder="请输入手机号" name="username" required=""  auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="密码" style="margin-bottom:0;">
          <el-input v-model="user.password" :type="showRpass?'text':'password'" placeholder="请输入密码" name="password" required="" auto-complete="new-password">
            <i slot="suffix" :class="['picon iconfont ',showRpass?'icon-xiaoyanjing-zheng':'icon-xiaoyanjing-bi']" @click="showRpass = !showRpass"></i>
          </el-input>
        </el-form-item>
        <div class="sub-box">
          <div class="captcha">
            <img :src="captchaPath" @click="getCaptcha()" class="captcha_img" width="125px">
            <input v-model="user.captcha" type="text" name="captcha" id="captcha" class="captcha_val" placeholder="验证码" required>
          </div>
          <a class="opbutton" href="#" @click="userLogin()">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            登录
          </a>
        </div>
        <p class="login_tip">{{loginTips}}</p>
        <div class="regist_find">
          <p class="register_tip"><span class="register_btn" @click="isFind = true,showRpass = false">忘记密码？</span></p>
          <p class="register_tip">没有账号？ <span class="register_btn" @click="goRegister()">→点我免费注册</span></p>
        </div>
        
      </el-form>
    </div>
    <!-- 注册 -->
    <div class="login-box" v-show="isRegister">
      <h2></h2>
      <el-form class="register_form" ref="registerForm" :model="register" :rules="registerRule" label-width="100px">
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="register.mobile" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="6-12位字母+数字" v-model="register.password" :type="showRpass?'text':'password'" auto-complete="new-password">
            <i slot="suffix" :class="['picon iconfont ',showRpass?'icon-xiaoyanjing-zheng':'icon-xiaoyanjing-bi']" @click="showRpass = !showRpass"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input placeholder="再次确认密码" v-model="register.repassword" type="password" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="realname">
          <el-input placeholder="1-5字的昵称" v-model="register.realname"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="company">
          <el-input placeholder="单位名称" maxlength="30" v-model="register.company"></el-input>
        </el-form-item>
        <el-form-item label="手机验证码" prop="mobilecode">
          <div style="display:flex;">
            <el-input v-model="register.mobilecode" type="text" name="mobilecode" id="captcha" class="captcha_val" placeholder="手机验证码" required></el-input>
            <el-button type="primary" @click="mobileCodeGet()" style="margin-left:10px;" :disabled="!cansend">{{cansend?'获取验证码':timeCount+'s后获取'}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div style="display:flex;">
            
            <el-input v-model="register.captcha" type="text" name="captcha" id="captcha" class="captcha_val" placeholder="验证码" required></el-input>
            <img :src="captchaPath" @click="getCaptcha()" class="captcha_img" width="113px" style="margin-left:10px">
          </div>
        </el-form-item>
        <div class="useragree_box">
          <el-checkbox v-model="isAgree"></el-checkbox>
          <span style="color:#cbcbcb;margin-left:5px;">我已阅读并接受</span>
          <span @click="showAgree = true" style="color:#f60;cursor:pointer">《投资云地图用户协议》</span>
        </div>
        <a class="opbutton" href="#" @click="userRegister()" style="width:50%">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          注册
        </a>
        <p class="register_tip"><span class="register_btn" @click="isRegister = false,showRpass = false">→返回登录</span></p>
      </el-form>
    </div>
    <!-- 修改密码 -->
    <div class="login-box" v-show="isFind">
      <h2>修改密码</h2>
      <el-form ref="findForm" class="modify_form" :model="findForm" :rules="findRules" label-width="100px">
        <el-form-item label="手机号" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="findForm.mobile" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="手机验证码" prop="mobilecode">
          <div style="display:flex;">
            <el-input v-model="findForm.mobilecode" type="text" name="mobilecode" id="captcha" class="captcha_val" placeholder="手机验证码" required></el-input>
            <el-button type="primary" @click="mobileCodeGet()" style="margin-left:10px;" :disabled="!cansend">{{cansend?'获取验证码':timeCount+'s后获取'}}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入新密码" v-model="findForm.password" :type="showRpass?'text':'password'" auto-complete="new-password" >
            <i slot="suffix" :class="['picon iconfont ',showRpass?'icon-xiaoyanjing-zheng':'icon-xiaoyanjing-bi']" @click="showRpass = !showRpass"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input placeholder="再次确认密码" v-model="findForm.repassword" type="password" auto-complete="new-password" ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div style="display:flex;">
            <el-input v-model="findForm.captcha" type="text" name="captcha" id="captcha" class="captcha_val" placeholder="验证码" required></el-input>
            <img :src="captchaPath" @click="getCaptcha()" class="captcha_img" width="113px" style="margin-left:10px">
          </div>
        </el-form-item>
        <a class="opbutton" href="#" @click="findPassword()" style="width:50%">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          确认修改
        </a>
        <p class="register_tip"><span class="register_btn" @click="isFind = false,showRpass = false">→返回登录</span></p>
      </el-form>
    </div>
    <!-- 注册协议 -->
    <el-dialog
      title="注册协议"
      :append-to-body="true"
      :visible.sync="showAgree"
      width="40%"
      >
      <div class="register_agree" :style="{height:agreeHeight+'px'}">
        <h3 style="margin-top:0;">特别提示：</h3>
        <p style="color: #d32424;">您在使用投资云地图提供的各项服务之前，请您务必审慎阅读、充分理解本协议各条款内容，特别是以粗体标注的部分，包括但不限于免除或者限制责任的条款。如您不同意本服务协议及/或随时对其的修改，您可以主动停止使用投资云地图提供的服务；您一旦使用投资云地图提供的服务，即视为您已了解并完全同意本服务协议各项内容，包括投资云地图对服务协议随时所做的任何更新或修改，并成为我们的用户。</p>
        <h3>一、总则</h3>
        <p>1.用户可以使用投资云地图各个功能及部分单项增值服务，当用户使用投资云地图各单项增值服务时，用户的使用行为视为其对该单项服务的服务条款以及投资云地图在该单项服务中发出的各类公告的同意。</p>
        <p>2.投资云地图用户协议以及各个功能、单项增值服务条款和公告可由投资云地图随时更新，且无需另行通知。您在使用相关服务时,应关注并遵守其所适用的相关条款。</p>
        <h3>二、帐号注册与使用</h3>
        <p>您使用部分投资云地图产品或服务时需要注册投资云地图帐号，当您注册和使用投资云地图帐号时应遵守下述要求：</p>
        <p>1.用户注册成功后，投资云地图将给予每个用户一个用户帐号，用户可以自主设置帐号密码。该用户帐号和密码由用户负责保管；用户应当对以其用户帐号进行的所有活动和事件负法律责任。</p>
        <p>2.您按照注册页面提示填写信息、阅读并同意本协议且完成全部注册程序后，您可获得投资云地图平台（http://chengdu.keyanshe.ltd网站）帐号并成为投资云地图用户，您可以通过投资云地图帐户使用投资云地图平台的各项产品和服务。</p>
        <p>3.用户按注册页面引导填写信息，阅读并同意本协议且完成全部注册程序后，即可获得投资云地图帐号并成为用户。用户应提供及时、详尽及准确的个人资料，并不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。如果因注册信息不真实或更新不及时而引发的相关问题，投资云地图不负任何责任。您可以通过投资云地图帐号设置页面查询、更改您的信息，投资云地图帐号设置页面地址：http://chengdu.keyanshe.ltd/#/login?redirect=%2Flandmap，用户应当通过真实信息认证注册帐号，且用户提交的帐号名称和简介等注册信息中不得出现违法和不良信息，经投资云地图审核，如存在上述情况，投资云地图将不予注册。同时，在注册后，如发现用户以虚假信息骗取帐号名称注册，或其帐号名称和简介等注册信息存在违法和不良信息的，投资云地图有权不经通知单方采取限期改正、暂停使用、注销登记、收回等措施。</p>
        <p>4.投资云地图帐号包括帐户名称和密码，您可使用设置的帐户名称（手机号、昵称）和密码登录；在帐号使用过程中，为了保障您的帐号安全基于不同的终端以及您的使用习惯，我们可能采取不同的验证措施识别您的身份。例如您的帐户在新设备首次登录，我们可能通过密码加校验码的方式识别您的身份，验证方式包括但不限于短信验证码、服务使用信息验证等。</p>
        <p>5.用户不应将其帐号、密码转让、出售或出借予他人使用，帐号使用权仅属于初始申请注册人，用户应对帐号内的全部行为独立承担全部责任。如因帐号转让、买卖或出借导致的帐号纠纷或投资云地图无法判断帐号归属等情况，投资云地图有权拒绝提供帐号找回，并视情况采取冻结帐号、封禁帐号等措施。</p>
        <p>6.因您个人原因导致的帐号无法使用，如需找回投资云地图帐号，请按照投资云地图帐号找回要求提供相应的信息，并确保提供的信息合法真实有效，若提供的信息不符合要求或帐号的唯一凭证不再有效，无法通过投资云地图安全验证，因存在帐号被盗等安全风险导致无法判断帐号归属，投资云地图有权拒绝提供帐号找回服务，并视情况采取冻结帐号、封禁帐号等措施。您投资云地图帐号下绑定的手机号如因您个人原因停止使用，请尽快更改投资云地图帐号的绑定手机，否则如遇运营商二次放号，二次放号的用户可以通过您原来的手机号进行验证登录，可查看到您的全部帐号信息及产品使用信息，您的投资云地图帐号将无法继续使用，帐号内个人信息也有泄露的风险，请您务必及时更换绑定手机，如因未及时换绑手机号导致帐号丢失或个人信息泄露的责任由您自行承担，投资云地图有权拒绝提供帐号找回服务，并视情况采取冻结帐号、封禁帐号等措施。</p>
        <p>7.为了防止资源占用，如您连续12个月未使用您的投资云地图帐号或未通过投资云地图认可的其他方式登录过您的投资云地图帐户，投资云地图有权对该帐户进行注销，您将不能再通过该帐号登录名登录本网站或使用相关服务。如该帐户有关联的数据信息、待处理交易或余额等，投资云地图会在合理范围内协助您处理，请您按照投资云地图提示的方式进行操作。</p>
        <h3>三、使用规则</h3>
        <p>1.用户在使用投资云地图的服务时，必须遵守《网络安全法》等中华人民共和国相关法律法规的规定，用户应同意将不会利用本服务进行任何违法或不正当的活动，包括但不限于下列行为: </p>
        <span>（1）上载、展示、张贴、传播或以其它方式传送含有下列内容之一的信息：①反对宪法所确定的基本原则的；②危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；③损害国家荣誉和利益的；④散布谣言，扰乱社会秩序，破坏社会稳定的；⑤破坏国家宗教政策，宣扬邪教和封建迷信的；⑥煽动民族仇恨、民族歧视、破坏民族团结的；⑦含有虚假、有害、胁迫、侵害他人隐私、骚扰、侵害、中伤、粗俗、猥亵、或其它道德上令人反感的内容；⑧侮辱或者诽谤他人，侵害他人合法权利的；⑨散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；⑩含有中国法律、法规、规章、条例以及任何具有法律效力的规范所限制或禁止的其它内容。</span>
        <span>（2）不得为了任何非法目的而使用投资云地图服务系统。</span>
        <span>（3）不利用投资云地图的服务从事以下活动：①未经允许，进入计算机信息网络或者使用计算机信息网络资源的；②未经允许，对进入计算机信息网络中存储、处理或者传输的数据和应用程序进行删除、修改或者增加的；③未经允许，对计算机信息网络功能进行删除、修改或者增加的；④故意制作、传播计算机病毒等破坏性程序的；⑤其他危害计算机信息网络安全的行为。</span>
        <p>2.用户违反本协议或相关的服务条款的规定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，您同意赔偿投资云地图与合作公司、关联公司，并使之免受损害。对此，投资云地图有权视用户的行为性质，采取包括但不限于删除用户发布信息内容、暂停使用许可、终止服务、限制使用、回收投资云地图帐号、追究法律责任等措施。对恶意注册投资云地图帐号或利用投资云地图帐号进行违法活动、捣乱、骚扰、欺骗、其他用户以及其他违反本协议的行为，投资云地图有权回收其帐号。同时，投资云地图会视司法部门的要求，协助调查。</p>
        <p>3.用户不得对本服务的任何部分（包括但不局限于数据、图片等资料）进行出售、转售或用于任何其它商业目的。若用于媒体发布，需征得政府相关部门及投资云地图版权所有者同意，且在媒体发布时注明资料出处。同时，对于用户违规对外发布导致的一切后果，由发布者自行承担，投资云地图将保留对违规发布者追责的权利。</p>
        <p>4.用户在使用投资云地图服务过程中，投资云地图能够满足用户选择公开或不公开用户自己上传的信息。因此，对于可能会涉密的国家或地方政府的地理信息、规划信息等（如地形图、政府未正式对外公布的总体规划图、片区控制性详细规划图等），用户不得随意对外公开。若用户通过投资云地图平台对外公开涉密信息的，用户应当对该泄密行为负责。同时，投资云地图有权选择终止或回收其帐号，并配合政府相关部门调查。</p>
        <p>5.用户在上传资料信息时，对于自己主动选择公开的信息，成功上传后可以被其他用户查阅和调用。因此，用户执行上述行为即表示用户同意将自己上传的信息对外公开并允许其他用户查阅和调用。用户主动公开信息属于用户自愿行为，用户不得以此要求获得相应报酬。其他用户在查阅或调用他人公开的信息时，应持审慎态度，自主判别数据信息的真实性和准确性，投资云地图平台不对数据信息的真实性和准确性负责。</p>
        <p>6.用户须对自己在使用投资云地图服务过程中的行为承担法律责任。用户承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在投资云地图首先承担了因用户行为导致的行政处罚或侵权损害赔偿责任后，用户应给予投资云地图等额的赔偿。</p>
        <p>7.用户在使用投资云地图服务时遵守以下互联网底线：①国家利益底线；②法律法规底线；③社会主义制度底线；④社会公共秩序底线；⑤公民合法权益底线；⑥道德风尚底线；⑦信息真实性底线。</p>
        <h3>四、服务内容</h3>
        <p>1.投资云地图网络服务的具体内容由投资云地图根据实际情况提供。</p>
        <p>2.除非本服务协议另有其它明示规定，投资云地图所推出的新产品、新功能、新服务，均受到本服务协议的规范。</p>
        <p>3.为使用本服务，您必须能够自行经有法律资格对您提供互联网接入服务的第三方，进入国际互联网，并应自行支付相关服务费用。此外，您必须自行配备及负责与国际联网连线所需之一切必要装备，包括计算机、数据机或其它存取装置。</p>
        <p>4.鉴于网络服务的特殊性，用户同意投资云地图有权不经事先通知，随时变更、中断或终止部分或全部的网络服务（包括收费网络服务）。投资云地图不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。</p>
        <p>5.免责声明：因以下情况造成网络服务在合理时间内的中断，投资云地图无需为此承担任何责任。</p>
        <span>（1）投资云地图需要定期或不定期地对提供网络服务的平台或相关的设备进行检修或者维护，投资云地图保留不经事先通知为维修保养、升级或其它目的暂停本服务任何部分的权利。</span>
        <span>（2）因台风、地震、洪水、雷电或恐怖袭击等不可抗力原因；</span>
        <span>（3）用户的电脑软硬件和通信线路、供电线路出现故障的；</span>
        <span>（4）因病毒、木马、恶意程序攻击、网络拥堵、系统不稳定、系统或设备故障、通讯故障、电力故障、银行原因、第三方服务瑕疵或政府行为等原因。 尽管有前款约定，投资云地图将采取合理行动积极促使服务恢复正常。</span>
        <p>6.本服务或第三人可提供与其它国际互联网上的网站或资源链接。由于投资云地图无法控制这些网站及资源，您了解并同意，此类网站或资源是否可供利用，投资云地图不予负责，存在或源于此类网站或资源的任何内容、广告、产品或其它资料，投资云地图亦不予保证或负责。因使用或依赖任何此类网站或资源发布的或经由此类网站或资源获得的任何内容、商品或服务所产生的任何损害或损失，投资云地图不承担任何责任。</p>
        <p>7.用户明确同意其使用投资云地图网络服务所存在的风险将完全由其自己承担。用户理解并接受下载或通过投资云地图服务取得的任何信息资料取决于用户自己，并由其承担系统受损、资料丢失以及其它任何风险。投资云地图对在服务网上得到的任何商品购物服务、交易进程、招聘信息，都不作担保。</p>
        <p>8.终止服务：您在使用投资云地图期间，因任何理由，包含但不限于长时间（超过一年）未使用，或投资云地图认为您已经违反本服务协议的文字及精神，终止您的密码、帐号或本服务的使用（或服务的任何部分），并将您在本服务内任何内容加以移除并删除。您同意依本服务协议任何规定提供的本服务，无需进行事先通知即可中断或终止，您承认并同意，投资云地图可立即关闭或删除您的帐号及您帐号中所有相关信息及文件，或禁止继续使用前述文件或本服务。此外，您同意若本服务的使用被中断或终止或您的帐号及相关信息和文件被关闭或删除，投资云地图对您或任何第三人均不承担任何责任。</p>
        <h3>五、知识产权和其他合法权益（包括但不限于名誉权、商誉权）</h3>
        <p>1.投资云地图拥有本网站内所有资料的版权。任何被授权的浏览、复制、打印和传播属于本网站内的资料必须符合以下条件：</p>
        <span>（1）所有的资料和图象均以获得信息为目的；</span>
        <span>（2）所有的资料和图象均不得用于商业目的；</span>
        <span>（3）所有的资料、图象及其任何部分都必须包括此版权声明；</span>
        <span>（4）本网站所有的产品、技术与所有程序的知识产权均属于上海寻圭信息科技有限公司，用户使用由上海寻圭信息科技有限公司授权。</span>
        <p>2.对于用户通过投资云地图服务上传到投资云地图网站上可公开获取区域的任何内容，用户同意投资云地图在全世界范围内具有免费的、永久性的、不可撤销的、非独家的和完全再许可的权利和许可，以使用、复制、修改、改编、出版、翻译、据以创作衍生作品、传播、表演和展示此等内容（整体或部分），和/或将此等内容编入当前已知的或以后开发的其他任何形式的作品、媒体或技术中。</p>
        <h3>六、其他</h3>
        <p>1.本协议的订立、执行和解释及争议的解决均应适用中华人民共和国法律。</p>
        <p>2.如双方就本协议内容或其执行发生任何争议，双方应尽量友好协商解决；协商不成时，任何一方均可向投资云地图所在地上海市浦东新区人民法院提起诉讼。</p>
        <p>3.如本协议中的任何条款无论因何种原因完全或部分无效或不具有执行力，本协议的其余条款仍然有效并且有约束力。</p>
        <p>4.请您在发现任何违反本服务协议以及其他任何单项服务的服务条款、投资云地图各类公告的情形时，通知投资云地图。您可以通过电话或微信方式与投资云地图联系，投资云地图小助手联系电话17311433572（微信同号）。</p>
        <p style="text-align:right;">上海寻圭信息科技有限公司</p>
      </div>
      <div class="agree_footer">
        <el-button type="warning" @click="agreeRule()">同意协议</el-button>
      </div>
    </el-dialog>
    <p class="user_tip">建议浏览器：谷歌浏览器 推荐尺寸：1920*1080</p>
    <p class="footer_tip">© copyright 2021 by <span style="color:#ff9e0d;">www.tzymap.com</span> <a href="https://beian.miit.gov.cn/" target="_blank" style="color:#bebebe;">蜀ICP备2021010208号-1</a></p>
  </div>
</template>

<script>
//import '@/assets/js/loginbg'
import userApi from "@/api/userApi";
import commonApi from "@/api/commonApi";
import { getUUID } from "@/utils/public";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isRegister:false,//注册状态
      user: {
        username: "",
        password: "",
        captcha:"",
        uuid:""
      },
      timeCount:60,//获取验证码倒计时
      cansend:true,//可发送验证码
      register:{
        mobile:"",//手机号
        password:"",//密码
        repassword:"",//重复密码
        realname:"",//昵称
        company:"",//单位
        mobilecode:"",//手机验证码
        captcha:"",//验证码
        msgId:"",//手机验证码id
        uuid:"",
      },
      isScroll:false,
      scrollTop:100,
      passwordType:"text",
      loginTips:null,
      showLoginBox:false,
      captchaPath:"",//验证码图片路径
      registerRule: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { type: 'number', validator: (rule, value, callback)=>{this.checkPhone(rule, value, callback)}, message: '请输入11位有效手机号号码', trigger: ['blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback)=>{this.checkPassword(rule, value, callback)}, message: '密码必须是由6-12位字母+数字组合', trigger: ['blur'] }
        ],
        repassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: "密码必须是由6-12位字母+数字组合", trigger: "blur"},
          { validator: (rule, value, callback)=>{this.checkRepassword(rule, value, callback)}, message: '两次输入密码不一致', trigger: "blur", required: true }
        ],
        realname: [
          { required: false, min:1, max:8, message: '请输入1-8字的昵称', trigger: 'blur' }
        ],
        mobilecode: [
          { required: true, message: '请填写手机验证码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请填写验证码', trigger: 'blur' }
        ],
      },
      isAgree:false,//接受注册协议
      showAgree:false,//显示协议
      agreeHeight:window.innerHeight-400,
      isFind:false,//密码找回状态
      findForm:{ //密码找回
        mobile:'', //手机号
        mobilecode:'', //手机验证码
        password:'', //密码
        repassword:'', //重复密码
        captcha:'', //验证码
        msgId:"",//手机验证码id
        uuid:''
      },
      findRules:{ //找回校验
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback)=>{this.checkPassword(rule, value, callback)}, message: '密码必须是由6-12位字母+数字组合', trigger: ['blur'] }
        ],
        repassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, max: 16, message: "密码必须是由6-12位字母+数字组合", trigger: "blur"},
          { validator: (rule, value, callback)=>{this.checkRepassword(rule, value, callback)}, message: '两次输入密码不一致', trigger: "blur", required: true }
        ],
        mobilecode: [
          { required: true, message: '请填写手机验证码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请填写验证码', trigger: 'blur' }
        ]
      },
      registerNum:null,//注册人数

      showRpass:false,//注册显示密码
    };
  },
  computed: {
    ...mapGetters(["token"])
  },
  watch:{
    isRegister:{
      handler(newVal){
        this.getCaptcha()
      }
    },
    isFind:{
      handler(newVal){
        this.getCaptcha()
      }
    }
  },
  methods: {
    //校验手机格式
    checkPhone(rule, value, callback){
      let reg = /^1[345789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    },
    //校验密码格式
    checkPassword(rule,value,callback){
      let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/
      if(!reg.test(value)){callback(new Error('密码必须是由6-12位字母+数字组合'))
      }else{
          callback()
      }
    },
    //校验密码是否一致
    checkRepassword(rule,value,callback){
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== (this.isRegister?this.register.password:this.findForm.password)) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    //获取手机校验码
    mobileCodeGet(){
      var that = this
      let reg = /^1[345789]\d{9}$/
      let mobile = ''
      if(that.isRegister){
        mobile = this.register.mobile
      }
      if(that.isFind){
        mobile = this.findForm.mobile
      }
      if(!reg.test(mobile)){
        that.$message.warning('请先输入正确的手机号')
      }else{
        that.cansend = false
        userApi.getMobileCode(mobile)
        .then(res=>{
          if(res.data.code===0){
            if(that.isRegister){
              that.register.msgId = res.data.data
            }
            if(that.isFind){
              that.findForm.msgId = res.data.data
            }
            var timer = window.setInterval(()=>{
              if(that.timeCount>0){
                that.timeCount --
              }else{
                that.timeCount = 60
                clearInterval(timer)
                that.cansend = true
              }
            },1000)
          }else{
            that.$message.warning('获取验证码失败')
          }
        })
      }
    },
    goRegister(){
      this.isRegister = true
      this.showRpass = false
    },
    //注册账号
    userRegister() {
      var that = this
      that.$refs.registerForm.validate((valid) => {
        if (valid) {
          if(!that.isAgree){
            that.$message.warning('请先阅读并接受《投资云地图用户协议》')
            return
          }
          let data = {
            mobile:that.register.mobile,
            realname:that.register.realname,
            company:that.register.company,
            password:that.register.password,
            captcha:that.register.captcha,
            mobilecode:that.register.mobilecode,
            msgId:that.register.msgId,
            uuid:that.register.uuid,
          }
          userApi.userRegister(data)
          .then(res=>{
            console.log(res)
            if(res.data.code===0){
              that.$message.success('注册成功,请登录')
              that.showRpass = false
              setTimeout(_=>{
                that.$refs.registerForm.resetFields();
                that.isRegister = false
              },1500)
            }else{
              that.$message.error(res.data.msg)
              if(res.data.code===10007){
                that.getCaptcha()
              }
            }
          })
        } else {
          console.log('请先完善信息');
          return false;
        }
      });
    },
    //用户登录
    async userLogin() {
      if(this.user.username==""||this.user.password==""){
        this.loginTips = "请输入用户名或密码"
          setTimeout(()=>{
            this.loginTips = null
          },2000)
      }else{
        let res = await userApi.login(this.user);
        if (res) {
          console.log(res)
          this.loginTips = res.data.msg
          setTimeout(()=>{
            this.loginTips = null
          },2000)
          if(res.data.code === 0){
            this.loginTips = '登录成功'
            this.showRpass = false
            let data = res.data.data
            //登录状态存入vuex
            this.$store.dispatch('setIsLogin',true)
            window.sessionStorage.clear();
            this.$store.dispatch("setToken", data.token);
            //用户昵称
            localStorage.setItem("userName", data.realname);
            //用户头像
            if(data.headUrl){
              localStorage.setItem("headUrl", data.headUrl);
            }
            this.passwordType = "text"
            this.$router.push({ path: this.redirect || "/" });
            //销毁监听事件
            window.removeEventListener('keydown',this.keyDown,false);
          }else{
            this.getCaptcha()
            this.loginTips = res.data.msg
            setTimeout(()=>{
              this.loginTips = null
            },2000)
          }
        }
      }
      
    },
    //密码重置
    findPassword(){
      var that = this
      that.$refs.findForm.validate((valid) => {
      if (valid) {
        let data = {
          mobile:that.findForm.mobile,
          newPassword:that.findForm.password,
          captcha:that.findForm.captcha,
          mobilecode:that.findForm.mobilecode,
          uuid:that.findForm.uuid,
          msgId:that.findForm.msgId,
        }
        userApi.findPassword(data)
        .then(res=>{
          console.log(res)
          if(res.data.code===0){
            that.$message.success('密码修改成功,请重新登录')
            that.showRpass = false
            setTimeout(_=>{
              that.$refs.findForm.resetFields();
              that.isFind = false
            },1500)
          }else{
            that.$message.error(res.data.msg)
            if(res.data.code===10007){
              that.getCaptcha()
            }
          }
        })
      } else {
        console.log('请先完善信息');
        return false;
      }
    });
    },
    showLogin(){//弹出登录框
      this.showLoginBox = true
    },
    hidebox(){
      this.showLoginBox = false
      console.log(1)
    },
    keyDown(e){
      if(e.keyCode==13){
        this.userLogin()
      }
    },
    getCaptcha () { //获取随机ID生成验证码
      let uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
      })
      if(!this.isFind&&!this.isRegister){
        this.user.uuid = uuid
      }
      if(this.isRegister){
        this.register.uuid = uuid
      }
      if(this.isFind){
        this.findForm.uuid = uuid
      }
      this.captchaPath = process.env.BASE_URL + "/captcha?uuid=" + uuid
      
    },
    //同意协议
    agreeRule(){
      this.showAgree = false
      this.isAgree = true
    },
    //登录背景图
    setLoginbg(){
      var that = this 
      var canvas = that.$('#bg').children('canvas'),
      background = canvas[0],
      foreground1 = canvas[1],
      foreground2 = canvas[2],
      config = {
        circle: {
            amount: 18,
            layer: 3,
            color: [157, 97, 207],
            alpha: 0.3
        },
        line: {
            amount: 12,
            layer: 3,
            color: [255, 255, 255],
            alpha: 0.3
        },
        speed: 0.5,
        angle: 20
    };
    if (background.getContext) {
        var bctx = background.getContext('2d'),
        fctx1 = foreground1.getContext('2d'),
        fctx2 = foreground2.getContext('2d'),
        M = window.Math,
        degree = config.angle / 360 * M.PI * 2,
        circles = [],
        lines = [],
        wWidth,
        wHeight,
        timer;
        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
        function (callback, element) {
            setTimeout(callback, 1000 / 60)
        };
        cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || clearTimeout;
        var setCanvasHeight = function () {
            wWidth = that.$(window).width();
            wHeight = that.$(window).height(),
            canvas.each(function () {
                this.width = wWidth;
                this.height = wHeight
            })
        };
        var drawCircle = function (x, y, radius, color, alpha) {
            var gradient = fctx1.createRadialGradient(x, y, radius, x, y, 0);
            gradient.addColorStop(0, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')');
            gradient.addColorStop(1, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha - 0.1) + ')');
            fctx1.beginPath();
            fctx1.arc(x, y, radius, 0, M.PI * 2, true);
            fctx1.fillStyle = gradient;
            fctx1.fill()
        };
        var drawLine = function (x, y, width, color, alpha) {
            var endX = x + M.sin(degree) * width,
            endY = y - M.cos(degree) * width,
            gradient = fctx2.createLinearGradient(x, y, endX, endY);
            gradient.addColorStop(0, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + alpha + ')');
            gradient.addColorStop(1, 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (alpha - 0.1) + ')');
            fctx2.beginPath();
            fctx2.moveTo(x, y);
            fctx2.lineTo(endX, endY);
            fctx2.lineWidth = 3;
            fctx2.lineCap = 'round';
            fctx2.strokeStyle = gradient;
            fctx2.stroke()
        };
        var drawBack = function () {
            bctx.clearRect(0, 0, wWidth, wHeight);
            var gradient = [];
            gradient[0] = bctx.createRadialGradient(wWidth * 0.3, wHeight * 0.1, 0, wWidth * 0.3, wHeight * 0.1, wWidth * 0.9);
            gradient[0].addColorStop(0, 'rgb(0, 26, 77)');
            gradient[0].addColorStop(1, 'transparent');
            bctx.translate(wWidth, 0);
            bctx.scale(-1, 1);
            bctx.beginPath();
            bctx.fillStyle = gradient[0];
            bctx.fillRect(0, 0, wWidth, wHeight);
            gradient[1] = bctx.createRadialGradient(wWidth * 0.1, wHeight * 0.1, 0, wWidth * 0.3, wHeight * 0.1, wWidth);
            gradient[1].addColorStop(0, 'rgb(0, 150, 240)');
            gradient[1].addColorStop(0.8, 'transparent');
            bctx.translate(wWidth, 0);
            bctx.scale(-1, 1);
            bctx.beginPath();
            bctx.fillStyle = gradient[1];
            bctx.fillRect(0, 0, wWidth, wHeight);
            gradient[2] = bctx.createRadialGradient(wWidth * 0.1, wHeight * 0.5, 0, wWidth * 0.1, wHeight * 0.5, wWidth * 0.5);
            gradient[2].addColorStop(0, 'rgb(40, 20, 105)');
            gradient[2].addColorStop(1, 'transparent');
            bctx.beginPath();
            bctx.fillStyle = gradient[2];
            bctx.fillRect(0, 0, wWidth, wHeight)
        };
        var animate = function () {
            var sin = M.sin(degree),
            cos = M.cos(degree);
            if (config.circle.amount > 0 && config.circle.layer > 0) {
                fctx1.clearRect(0, 0, wWidth, wHeight);
                for (var i = 0,
                len = circles.length; i < len; i++) {
                    var item = circles[i],
                    x = item.x,
                    y = item.y,
                    radius = item.radius,
                    speed = item.speed;
                    if (x > wWidth + radius) {
                        x = -radius
                    } else if (x < -radius) {
                        x = wWidth + radius
                    } else {
                        x += sin * speed
                    }
                    if (y > wHeight + radius) {
                        y = -radius
                    } else if (y < -radius) {
                        y = wHeight + radius
                    } else {
                        y -= cos * speed
                    }
                    item.x = x;
                    item.y = y;
                    drawCircle(x, y, radius, item.color, item.alpha)
                }
            }
            if (config.line.amount > 0 && config.line.layer > 0) {
                fctx2.clearRect(0, 0, wWidth, wHeight);
                for (var j = 0,
                len = lines.length; j < len; j++) {
                    var item = lines[j],
                    x = item.x,
                    y = item.y,
                    width = item.width,
                    speed = item.speed;
                    if (x > wWidth + width * sin) {
                        x = -width * sin
                    } else if (x < -width * sin) {
                        x = wWidth + width * sin
                    } else {
                        x += sin * speed
                    }
                    if (y > wHeight + width * cos) {
                        y = -width * cos
                    } else if (y < -width * cos) {
                        y = wHeight + width * cos
                    } else {
                        y -= cos * speed
                    }
                    item.x = x;
                    item.y = y;
                    drawLine(x, y, width, item.color, item.alpha)
                }
            }
            timer = requestAnimationFrame(animate)
        };
        var createItem = function () {
            circles = [];
            lines = [];
            if (config.circle.amount > 0 && config.circle.layer > 0) {
                for (var i = 0; i < config.circle.amount / config.circle.layer; i++) {
                    for (var j = 0; j < config.circle.layer; j++) {
                        circles.push({
                            x: M.random() * wWidth,
                            y: M.random() * wHeight,
                            radius: M.random() * (20 + j * 5) + (20 + j * 5),
                            color: config.circle.color,
                            alpha: M.random() * 0.2 + (config.circle.alpha - j * 0.1),
                            speed: config.speed * (1 + j * 0.5)
                        })
                    }
                }
            }
            if (config.line.amount > 0 && config.line.layer > 0) {
                for (var m = 0; m < config.line.amount / config.line.layer; m++) {
                    for (var n = 0; n < config.line.layer; n++) {
                        lines.push({
                            x: M.random() * wWidth,
                            y: M.random() * wHeight,
                            width: M.random() * (20 + n * 5) + (20 + n * 5),
                            color: config.line.color,
                            alpha: M.random() * 0.2 + (config.line.alpha - n * 0.1),
                            speed: config.speed * (1 + n * 0.5)
                        })
                    }
                }
            }
            cancelAnimationFrame(timer);
            timer = requestAnimationFrame(animate);
            drawBack()
        };
        that.$(document).ready(function () {
            setCanvasHeight();
            createItem()
        });
        that.$(window).resize(function () {
            setCanvasHeight();
            createItem()
        })
    }

    },
    //获取注册人数
    getRegisterState(){
      userApi.getRegisterNum()
      .then(res=>{
        this.registerNum = res.data
      })
    },
  },
  created(){
    this.getCaptcha()
    this.getRegisterState()
  },
  mounted(){
     window.addEventListener('keydown',this.keyDown) // 监听滚动事件
     this.setLoginbg()
  }
};
</script>

<style lang="scss">
.picon{
  line-height: 10px;
  margin-right: 5px;
  cursor: pointer;
  &:hover{
    color: #ff9e0d;
  }
}
#bg{
  background: #171c2c;
}
#bg canvas{
  position:absolute;top:0;left:0;width:100%;height:100%;
}
.login_tip{
  bottom: 0px;
  left: 40px;
  position: absolute;
  font-size: 12px;
  color: #ff1f62;
  
}
.register_agree{
  overflow-y:scroll;
  text-align: left;
  p{
    text-indent: 2em;
  }
}
.agree_footer{
  width: 100%;
  background: #fff;
  padding-top: 10px;
  display: flex;
  justify-content: center;
}
.useragree_box{
  margin-bottom: 20px;
}
.regist_find{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.register_tip{
  font-size: 12px;
  color: #ff9e0d;
  user-select: none;
  .register_btn{
    cursor: pointer;
    &:hover{
      color: chartreuse;
    }
  }
}
.login_form{
  .el-form-item__label{
    float: left;
    padding: 0;
    color: #fff;
  }
  .sub-box{
    margin-top: 30px;
  }
}
.register_form{
  .el-form-item{
    margin-bottom: 16px;
  }
  .el-form-item__label{
    color: #bebebe;
  }
  .register{
    height: 40px;
    width: 65%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .captcha_val{
      width: 100px;
      margin-left: 0;
      margin-right: 10px;
    }
  }
}
.modify_form{
  .el-form-item__label{
    color: #bebebe;
  }
}
.user_tip{
  bottom: 30px;
  left: 30px;
  text-align: center;
  position: absolute;
  font-size: 12px;
  color: #638cb6;
}
.footer_tip{
  font-size: 16px;
  font-weight: 400;
  color: #bebebe;
  margin: 0;
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  text-align: center;
}
.login_wrap{
  // background: url('~@/assets/img/login/login_bg.gif') no-repeat;
  // background-size: cover;
  width: 100vw;
  height: 100vh;
  position: relative;
  text-align: center;
  .sys_top{
    position: relative;
    z-index: 99;
    padding-top: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    .sys_logo{
      width: 60px;
      margin-right: 30px;
    }
    .sys_name{
      letter-spacing: 12px;
      font-size: 42px;
      font-weight: bold;
      color: #fff;
      user-select: none;
      font-family: '微软雅黑';
      text-shadow: 
        0 0 10px #0ebeff,
        0 0 20px #0ebeff,
        0 0 50px #0ebeff,
        0 0 100px #0ebeff,
        0 0 200px #0ebeff;
    }
  }
}
.login-box {
  position: absolute;
  z-index: 9999;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,.5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0,0,0,.6);
  border-radius: 10px;
  input:-webkit-autofill {
  　　-webkit-box-shadow: 0 0 0px 1000px white inset;
  　　-webkit-text-fill-color: #333;
  }
}

.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-bottom: 30px;
  border: none;
  border-bottom: 1px solid #909399;
  outline: none;
  background: transparent;
  border-radius: 0;
}
.login-box .user-box label {
  position: absolute;
  top:0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: .5s;
}

.login-box .user-box input:focus ~ .user-box label,
.login-box .user-box input:valid ~ .user-box label {
  top: -30px !important;
  left: 0 !important;
  color: #03e9f4 !important;
  font-size: 12px !important;
}
.sub-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  .captcha{
    height: 40px;
    width: 60%;
    display: flex;
    align-items: center;
  }
  
  .captcha_img{
    height: 100%;
  }
  .captcha_val{
    height: 36px;
    width: 70px;
    margin-left: 10px;
  }
}
.login-box form .opbutton {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: .5s;
  letter-spacing: 4px
}

.login-box .opbutton:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4,
              0 0 25px #03e9f4,
              0 0 50px #03e9f4,
              0 0 100px #03e9f4;
}

.login-box .opbutton span {
  position: absolute;
  display: block;
}

.login-box .opbutton span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}
@keyframes scale {
  0% {
      mask-size: 100% 100%;
  }
  60%,
  100% {
      mask-size: 150% 800%;
  }
}
@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: .25s
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: .5s
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: .75s
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,100% {
    bottom: 100%;
  }
}
@media screen and (max-height: 800px) {
  .sys_top{
    padding-top: 3vh!important;
  }
}
</style>
