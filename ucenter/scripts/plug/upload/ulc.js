
    C4js.NewUer=function(args,auto){
        return new C4js.Uer(g_conf.FSRV_UPLOAD, {
            m: "C",
            token:QueryStringByName("token")
        }, auto);
    };
		